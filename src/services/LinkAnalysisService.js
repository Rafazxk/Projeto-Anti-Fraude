import LinkFraudEngine from "../domain/engines/LinkFraudEngine.js";
import CheckBlacklist from "../domain/rules/link/CheckBlacklist.js";
import CheckDomainStructure from "../domain/rules/link/CheckDomainStructure.js";
import CheckTyposquatting from "../domain/rules/link/checkTyposquatting.js";
import CheckDomainAge from "../domain/rules/link/checkDomainAge.js";
import BlacklistRepository from "../repositories/BlacklistRepository.js";

class LinkAnalysisService {
  // Receba o repositório por parâmetro (Injeção de Dependência)
  constructor(blacklistRepo) {
    this.engine = new LinkFraudEngine([
      new CheckBlacklist(blacklistRepo), // Usa o repo passado
      new CheckDomainStructure(),
      new CheckTyposquatting(),
      new CheckDomainAge()
    ]);
  }

  async execute(context) {
    // 1. Extrair o domínio antes de mandar para o Engine
    const domain = this.extractDomain(context.url);
    if (!domain) return { status: "Erro", mensagem: "URL Inválida" };

    // 2. Rodar o Engine (passando o domínio no contexto)
    const analiseTecnica = await this.engine.execute({ ...context, domain });
    
    if (!analiseTecnica || analiseTecnica.score === 0) {
        return {
            status: "Seguro",
            score: 0,
            mensagem: "Não detectamos ameaças neste link.",
            classificacao: "Seguro",
            alertas: []
        };
    }

    const riscosTecnicos = analiseTecnica.riscos ?? [];
    const alertasHumanos = riscosTecnicos.map(risco => {
        if (risco.includes("marca")) return "O site tenta imitar uma empresa conhecida.";
        if (risco.includes("TLD")) return "O endereço utiliza uma terminação suspeita.";
        if (risco.includes("recente")) return "Este site foi criado há pouquíssimo tempo.";
        if (risco.includes("subdomínios")) return "A estrutura do link é confusa e oculta o destino real.";
        if (risco.includes("hífens")) return "O nome do site parece artificial e forçado.";
        return "Atividade incomum detectada.";
    }).filter(Boolean);

    let recomendacao = "Tenha cautela ao navegar.";
    if (analiseTecnica.score >= 200) {
        recomendacao = "NÃO forneça senhas ou dados pessoais.";
    } else if (analiseTecnica.score >= 100) {
        recomendacao = "Evite realizar pagamentos neste endereço.";
    }

    return {
        url: context.url,
        score: analiseTecnica.score,
        classificacao: analiseTecnica.classificacao, 
        alertas: [...new Set(alertasHumanos)], 
        conclusao: recomendacao
    };
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    } catch { return null; }
  }
}

export { LinkAnalysisService }; 

export default new LinkAnalysisService(BlacklistRepository);