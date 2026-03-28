class CheckSuspiciousTLD {
  async execute(context) {
    const domain = context.domain;

    if (!domain) return;

    const tld = this.extractTLD(domain);

    const suspiciousTLDs = [
      "xyz",
      "top",
      "click",
      "shop",
      "online",
      "info",
      "site",
      "biz",
      "cc"
    ];

    if (suspiciousTLDs.includes(tld)) {
     return {
       regra: "CHECK_SUSPICIOUS_TLD",
       pontuacao: 40,
       mensagem: `TLD Suspeito: .${tld}`
     };
    }
    return null;
  }

  extractTLD(domain) {
    const parts = domain.split(".");
    return parts[parts.length - 1];
  }
}

export default CheckSuspiciousTLD;