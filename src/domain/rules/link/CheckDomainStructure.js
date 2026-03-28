class CheckDomainStructure {
  async execute(context) {
    const domain = context.domain;
    if (!domain) return null;

    let pontuacao = 0;
    let mensagens = [];
    
    const partes = domain.split(".");
    const tld = partes[partes.length - 1].toLowerCase();

    console.log(`[Structure] Analisando estrutura de: "${domain}" (TLD: .${tld})`);

    // 1. Dicionário de TLDs com reputação duvidosa
    const tldSuspeitos = {
      "ru": 50,  // TLD Russo (muito usado em ataques globais)
      "tk": 45,  // TLD gratuito (foco de phishing)
      "xyz": 40, // Muito comum em fraudes recentes
      "top": 35,
      "gq": 35,
      "pw": 40,
      "online": 30,
      "site": 30
    };

    if (tldSuspeitos[tld]) {
      const pontosTLD = tldSuspeitos[tld];
      pontuacao += pontosTLD;
      mensagens.push(`TLD de alto risco detectado: .${tld}`);
      console.log(`[Structure] Alerta: TLD .${tld} adicionou ${pontosTLD} pontos.`);
    }

    // 2. Verificação de Subdomínios (Ex: login.seguro.atualizar.link.xyz)
    if (partes.length > 3) {
      pontuacao += 20;
      mensagens.push("Excesso de subdomínios detectado");
      console.log(`[Structure] Alerta: Muitos subdomínios (+20 pts).`);
    }

    // 3. Verificação de Hífens (Ex: itau-seguranca-login-app.com)
    // Phishings usam muitos hífens para criar nomes longos que parecem oficiais
    const hifens = (domain.match(/-/g) || []).length;
    if (hifens > 2) {
      const pontosHifen = 25;
      pontuacao += pontosHifen;
      mensagens.push("Uso excessivo de hífens");
      console.log(`[Structure] Alerta: ${hifens} hífens detectados (+${pontosHifen} pts).`);
    }

    if (pontuacao === 0) {
      console.log(`[Structure] Nenhuma anomalia estrutural em: ${domain}`);
      return null;
    }

    return {
      regra: "CHECK_DOMAIN_STRUCTURE",
      pontuacao,
      mensagem: mensagens.join(" | ")
    };
  }
}

export default CheckDomainStructure;