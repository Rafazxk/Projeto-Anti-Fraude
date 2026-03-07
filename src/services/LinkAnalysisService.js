import BlacklistRepository from "../repositories/BlacklistRepository.js";

class LinkAnalysisService {

  async execute({ url }) {

    if (!url) {
      throw new Error("URL é obrigatória");
    }

    const domain = this.extractDomain(url);

     console.log("dominio extraido: ", domain);
 
    if (!domain) {
      throw new Error("URL inválida");
    }

    const blacklistDomains = await BlacklistRepository.findAllDomains();

    for (const item of blacklistDomains) {

      const blacklistDomain = item.valor.toLowerCase();

      if (domain.endsWith(blacklistDomain)) {
        return {
          score: 400,
          maxScore: 400,
          classificacao: "Crítico",
          analise: "Domínio identificado na blacklist.",
          riscos: [`Domínio listado por: ${item.motivo}`],
          recomendacao: "Não acesse este link."
        };
      }
    }

    let score = 0;
    const maxScore = 400;
    const riscos = [];

    // Regra 1 — HTTP inseguro
    if (url.startsWith("http://")) {
      score += 100;
      riscos.push("O link utiliza HTTP, que não é seguro.");
    }

    // Regra 2 — Palavras suspeitas
    const suspiciousWords = ["login", "secure", "update", "verify"];

    suspiciousWords.forEach(word => {
      if (url.toLowerCase().includes(word)) {
        score += 80;
        riscos.push(`O link contém palavra suspeita: ${word}`);
      }
    });

    // Regra 3 — Domínio muito longo
    if (url.length > 30) {
      score += 60;
      riscos.push("O link é excessivamente longo, possível tentativa de mascaramento.");
    }

    let classificacao = "Seguro";

    if (score >= 200) {
      classificacao = "Alto Risco";
    } else if (score >= 100) {
      classificacao = "Médio Risco";
    }

    return {
      score,
      maxScore,
      classificacao,
      analise: "Análise baseada em padrões estruturais do link.",
      riscos,
      recomendacao:
        score >= 100
          ? "Recomenda-se não acessar este link."
          : "Nenhum risco significativo identificado."
    };
  }

  extractDomain(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "").toLowerCase();
    } catch {
      return null;
    }
    
    
  }
}

export default new LinkAnalysisService();