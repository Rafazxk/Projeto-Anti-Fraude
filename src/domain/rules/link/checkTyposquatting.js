class CheckTyposquatting {
  async execute(context) {
    const domain = context.domain;
    if (!domain) return null;

    const fullCleanDomain = domain.replace(/[-.]/g, "").toLowerCase();
    const parts = domain.split(".");
    const mainPart = parts[0].replace(/-/g, "").toLowerCase(); 

    const popularDomains = ["google", "facebook", "paypal", "nubank", "itau", "bradesco"];

    for (const legit of popularDomains) {
      
      if (fullCleanDomain.includes(legit)) {
        const isOfficial = domain.includes(`${legit}.com`) || domain.includes(`${legit}.net`);
        if (!isOfficial) {
          return { regra: "CHECK_TYPOSQUATTING", pontuacao: 100, mensagem: `Marca ${legit} detectada` };
        }
      }

      // 2. Verificação de Similaridade (Levenshtein)
      const distance = this.levenshtein(mainPart, legit);
      if (distance >= 1 && distance <= 2) {
        return {
          regra: "CHECK_TYPOSQUATTING",
          pontuacao: 80,
          mensagem: `Domínio visualmente parecido com ${legit}`
        };
      }
    }
    return null;
  }

  levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1] ? matrix[i - 1][j - 1] : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  }
}
export default CheckTyposquatting;