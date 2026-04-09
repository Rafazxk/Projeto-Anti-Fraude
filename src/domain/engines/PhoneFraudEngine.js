import ValidateNumberRule from "../phone/rules/ValidateNumberRule.js";
import CheckReportsRule from "../phone/rules/CheckReportsRule.js";
import ValidateFormatRule from "../phone/rules/ValidateFormatRule.js";

class PhoneFraudEngine {
  async analyze(numero) {
    let score = 0;
    const riscos = [];

    
    const numeroLimpo = numero.replace(/\D/g, ''); 

    const rules = [
      new ValidateNumberRule(),
      new CheckReportsRule(),
      new ValidateFormatRule()
    ];

    for (const rule of rules) {
      try {
        const result = await rule.execute(numeroLimpo);
        if (result && result.score > 0 && result.message) {
          console.log(`Regra: ${rule.constructor.name } | ADICIONOU ${result.score} pts`)
          score += result.score;
          riscos.push(result.message);
        }
      } catch (e) {
        console.error(`Erro na regra ${rule.constructor.name}:`, e.message);
      }
    }

    // Classificação final baseada no acumulado das regras
    let classificacao = "Seguro";
    if (score >= 120) {
      classificacao = "Golpe";
    } else if (score >= 60) {
      classificacao = "Suspeito";
    }
 
  console.log("classificacao final - ", classificacao);
 
    return {
      score,
      maxScore: 200,
      classificacao,
      alertas: riscos,
      conclusao: score >= 60 
        ? "Cuidado! Este número possui flags de risco." 
        : "Nenhum risco significativo identificado."
    };
  }
}

export default new PhoneFraudEngine();