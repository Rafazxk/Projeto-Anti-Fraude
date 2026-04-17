import LinkFraudEngine from "../domain/engines/LinkFraudEngine.js";
import CheckBlacklist from "../domain/rules/link/CheckBlacklist.js";
import CheckDomainStructure from "../domain/rules/link/CheckDomainStructure.js";
import CheckTyposquatting from "../domain/rules/link/checkTyposquatting.js";
import CheckDomainAge from "../domain/rules/link/checkDomainAge.js";
import BlacklistRepository from "../repositories/BlacklistRepository.js";

class LinkAnalysisService {
  constructor(blacklistRepo) {
    this.engine = new LinkFraudEngine([
      new CheckBlacklist(blacklistRepo),
      new CheckDomainStructure(),
      new CheckTyposquatting(),
      new CheckDomainAge()
    ]);

    // Taxonomia de riscos: mapeia o risco técnico para a explicação humana e o tipo de golpe
    this.MAPEAMENTO_RISCOS = {
      marca: { texto: "O site tenta imitar uma empresa conhecida.", tipo: "Phishing / Roubo de Dados" },
      TLD: { texto: "O endereço utiliza uma terminação suspeita.", tipo: "Ameaça de Infraestrutura" },
      recente: { texto: "Este site foi criado há pouquíssimo tempo.", tipo: "Golpe Financeiro" },
      subdomínios: { texto: "A estrutura do link é confusa e oculta o destino real.", tipo: "Redirecionamento Malicioso" },
      hífens: { texto: "O nome do site parece artificial e forçado.", tipo: "Engenharia Social" }
    };
  }

  async execute(context) {
    const domain = this.extractDomain(context.url);
    if (!domain) return { status: "Erro", mensagem: "URL Inválida" };

    const analiseTecnica = await this.engine.execute({ ...context, domain });
    
    if (!analiseTecnica || analiseTecnica.score === 0) {
        return {
            status: "Seguro",
            score: 0,
            tipoGolpe: "Nenhum",
            classificacao: "Seguro",
            alertas: [],
            conclusao: "Não detectamos ameaças neste link."
        };
    }

    const riscosTecnicos = analiseTecnica.riscos ?? [];
    const alertasHumanos = [];
    const tiposDetectados = new Set();

    // Processamento inteligente dos riscos
    riscosTecnicos.forEach(risco => {
        const chave = Object.keys(this.MAPEAMENTO_RISCOS).find(k => risco.includes(k));
        
        if (chave) {
            alertasHumanos.push(this.MAPEAMENTO_RISCOS[chave].texto);
            tiposDetectados.add(this.MAPEAMENTO_RISCOS[chave].tipo);
        } else {
            alertasHumanos.push("Atividade incomum detectada.");
        }
    });

    // Define o tipo de golpe 
    const tipoGolpe = tiposDetectados.size > 0 ? Array.from(tiposDetectados).join(" / ") : "Suspeita de Fraude";

    // Definição da recomendação baseada no score
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
        tipoGolpe: tipoGolpe, 
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