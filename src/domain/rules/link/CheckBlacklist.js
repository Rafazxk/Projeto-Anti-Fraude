class CheckBlacklist {
  constructor(blacklistRepository) {
    this.blacklistRepository = blacklistRepository;
  }
  
  async execute(dominio) {
    const registro = await this.blacklistRepository.findByDomain(dominio);

    if (!registro) return null;
   
    return {
      regra: "CHECK_BLACKLIST",
      pontuacao: 120,
      mensagem: "Domínio presente na blacklist",
    };
  }
}

export default CheckBlacklist;