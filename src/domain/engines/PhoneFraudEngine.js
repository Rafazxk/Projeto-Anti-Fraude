import ValidateNumberRule from "../phone/rules/ValidateNumberRule.js";
import CheckReportsRule from "../phone/rules/CheckReportsRule.js";
import CheckNumverifyRule from "../phone/rules/CheckNumverifyRule.js";

class PhoneFraudEngine {

  async analyze(numero) {
     
    let score = 0;
    const maxScore = 200;
    const riscos = [];
  
   const rules = [
     new ValidateNumberRule(),
     new CheckReportsRule(),
     new CheckNumverifyRule()
     ];
  
   for (const rule of rules){
      const result = await rule.execute(numero); 
     
     if(result){
       score+= result.score;
       riscos.push(result.message);
     }
   }   
    // regra 1 — número inválido
    if (!/^\+?\d{10,15}$/.test(numero)) {
      score += 70;
      riscos.push("Número inválido ou mal formatado.");
    }

    // regra 2 — país suspeito
    if (numero.startsWith("+234") || numero.startsWith("+92")) {
      score += 35;
      riscos.push("Número originado de país frequentemente associado a golpes.");
    }

    // regra 3 — número virtual
    if (numero.includes("000") || numero.includes("123")) {
      score += 40;
      riscos.push("Possível número virtual.");
    }

    let classificacao = "Seguro";

    if (score >= 120) {
      classificacao = "Golpe";
    } else if (score >= 60) {
      classificacao = "Suspeito";
    }

    return {
      score,
      maxScore,
      classificacao,
      analise:
        "O número foi analisado com base em padrões técnicos e sinais de reputação.",
      riscos,
      recomendacao:
        score >= 60
          ? "Evite atender chamadas desse número."
          : "Nenhum risco significativo identificado."
    };
  }
}

export default new PhoneFraudEngine();