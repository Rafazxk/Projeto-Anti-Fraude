class CheckDomainStructure {

  async execute(dominio) {

    if (!dominio) {
      return {
        regra: "CHECK_DOMAIN_INVALIDO",
        pontuacao: 40,
        mensagem: "Domínio inválido"
      };
    }

    let pontuacao = 0;
    let mensagens = [];

    const partes = dominio.split(".");

    if (partes.length > 3) {
      pontuacao += 15;
      mensagens.push("Muitos subdomínios detectados");
    }

    const tldSuspeitos = ["ru", "tk", "xyz", "top", "gq"];
    const tld = partes[partes.length - 1];

    if (tldSuspeitos.includes(tld)) {
      pontuacao += 20;
      mensagens.push("TLD suspeito");
    }

    if (pontuacao === 0) return null;

    return {
      regra: "CHECK_DOMAIN_STRUCTURE",
      pontuacao,
      mensagem: mensagens.join(", ")
    };
  }
}

export default CheckDomainStructure;