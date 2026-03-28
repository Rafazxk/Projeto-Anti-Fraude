class CheckBlacklist {
  constructor(blacklistRepository) {
    this.blacklistRepository = blacklistRepository;
  }

  async execute(context) {
    
    const registro = await this.blacklistRepository.findByDomain(context.domain);
   
   if(!registro) return null;
   
   return {
     regra: "CHECK_BLACKLIST",
     pontuacao: 150,
     mensagem: `dominio listado: ${registro.motivo || "sem motivo"}`
   };
  }
}

export default CheckBlacklist;