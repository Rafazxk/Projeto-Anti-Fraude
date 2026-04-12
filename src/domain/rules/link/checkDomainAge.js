class CheckDomainAge {
  async execute(context) {
    const ageInDays = await this.getDomainAge(context.domain);

// Exemplo de como mockar a classe de rede
if (process.env.NODE_ENV === 'test') {
    this.getDomainAge = async (domain) => 365; 
}

    // Se a API falhou ou o domínio não existe, não pontuamos (neutralidade)
    if (ageInDays === null) {
      console.log(`[Age] Não foi possível determinar a idade de: ${context.domain}`);
      return null;
    }

    console.log(`[Age] Domínio "${context.domain}" tem ${ageInDays} dias de vida.`);

    // Lógica de Pontuação (Invertida: quanto mais novo, mais perigoso)
    if (ageInDays < 7) {
      return {
        regra: "CHECK_DOMAIN_AGE",
        pontuacao: 100, // Subi para 100 pois domínios com < 7 dias são altíssimo risco
        mensagem: `Domínio extremamente recente (${ageInDays} dias)`
      };
    }

    if (ageInDays < 30) {
      return {
        regra: "CHECK_DOMAIN_AGE",
        pontuacao: 60,
        mensagem: "Domínio criado há menos de 1 mês"
      };
    }

    if (ageInDays < 180) { // Aumentei a janela para 6 meses (padrão de segurança)
      return {
        regra: "CHECK_DOMAIN_AGE",
        pontuacao: 30,
        mensagem: "Domínio recente (menos de 6 meses)"
      };
    }

    // Se for um domínio "ancião" (como o seu de 20.000 dias), retorna null = Seguro
    return null;
  }

 async getDomainAge(domain) {
  try {
    // 1. Limpeza para o WHOIS: pega apenas os últimos dois segmentos
    // Ex: 'itau.seguranca.login.net' -> 'login.net'
    const parts = domain.split(".");
    const rootDomain = parts.slice(-2).join("."); 

    console.log(`[Age] Consultando WHOIS para raiz: ${rootDomain}`);
    
    const response = await fetch(`https://api.whois.vu/?q=${rootDomain}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.created) return null;

    const createdDate = new Date(data.created);
    const now = new Date();
    const diffTime = now - createdDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));

  } catch (error) {
    console.error(`[Age] Erro: ${error.message}`);
    return null;
  }
}
}

export default CheckDomainAge;