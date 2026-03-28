import PhoneFraudEngine from "../domain/engines/PhoneFraudEngine.js";

class PhoneAnalysisService{
  async execute({ numero }) {
    
    if(!numero){
      throw new Error("telefone é obrigatorio");
    }
    
    const result = await PhoneFraudEngine.analyze(numero);
    
    return result;
  }
}

export default new PhoneAnalysisService();