import PhoneFraudEngine from "../domain/engines/PhoneFraudEngine.js";

class PhoneAnalysisService{
  async execute({ numero }) {
    
    if(!numero){
      throw new Error("telefone é obrigatorio");
    }
    
    const result = await PhoneFraudEngine.analyze(numero)
    
    return result;
    // return {
    //   score: 0,
    //   maxScore: 400,
    //   classificacao: "Seguro",
    //   analise: "prototipo inicial da analise de link",
    //   riscos: [],
    //   recomendacao: "nenhuma ação necessaria"
    // };
  }
}

export default new PhoneAnalysisService();