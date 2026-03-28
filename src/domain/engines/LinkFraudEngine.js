import BlacklistRepository from "../../repositories/BlacklistRepository.js"
class LinkFraudEngine {
  constructor(rules = []) {
    this.rules = rules;
  }

  async execute(context) {
    // Garantir que score e riscos existam para evitar erros de undefined
    context.score = context.score ?? 0;
    context.riscos = context.riscos ?? [];

    console.log("Iniciando análise. Score base:", context.score);

    for (const rule of this.rules) {
      try {
        const result = await rule.execute(context);

        if (result) {
          console.log(`[Regra: ${rule.constructor.name}] +${result.pontuacao} pts`);
          
          context.score += result.pontuacao || 0;

          if (result.mensagem) {
            context.riscos.push(result.mensagem);
          }
        }
      } catch (error) {
        console.error(`Erro na regra ${rule.constructor.name}:`, error.message);
      }
    }

    // Definir classificação técnica (opcional, mas ajuda o Service)
    if (context.score >= 200) context.classificacao = "Alto Risco";
    else if (context.score >= 70) context.classificacao = "Médio Risco";
    else context.classificacao = "Seguro";

    console.log("Score final acumulado:", context.score);

    return context;
  }
}

export default LinkFraudEngine;