import { extractTextFromImage } from "../utils/ocr.js";
import PrintFraudEngine from "../domain/engines/PrintFraudEngine.js";

class PrintAnalysisService{
  async execute({ image_path }) {
    
    if( !image_path ) {
    throw new Error("imagem é obrigatória");
    }
    
    const text = await extractTextFromImage(image_path);
    
    console.log("texto detectado: ", text);
    
    const result = PrintFraudEngine.analyze(text);
    
    return {
      score: result.score,
      maxScore: result.maxScore,
      classificacao: result.classificacao,
      analise: this.buildAnalysis(result),
      riscos: this.buildRisks(result),
      recomendacao: this.buildRecommendation(result)
    };
  }
   
   buildAnalysis(result) {
     if (result.classificacao === "Golpe"){
       console.log("risco detectado, ",  result);
       
       return "A mensagem apresenta padrões clássicos de tentativa de fraude com forte manipulação emocional";
     }
     
     if(result.classificacao === "Suspeito"){
       return "Foram identificados elementos suspeitos que podem indicar tentativa de golpe";
     }
     
     return "Nenhum padrão significativo de fraude foi identificado";
   }
    
  buildRisks(result){
    if(result.classificacao === "Suspeito"){
      return [
        "possivel tentativa de golpe",
        "exposição de dados bancarios",
        "insistencia em pix"
        ];
        
        return [];
    }
    
    if(result.classificacao === "Golpe"){
      return [
        "Perda financeira",
        "Roubo de conta",
        "Uso indevido de dados pessoais"
        ];
    }
    return [];
  }  
  
  buildRecommendation(result){
    if(result.classificacao === "Golpe"){
      return "Interrompa o contrato imediatamente e não envie códigos ou valores";
    }
    
    if(result.classificacao === "Suspeito"){
      return "Evite compartilhar informações sensíveis e confirme a identidade do remetente.";
    }
    
    return "Nenhuma ação necessária.";
  }  
}    
    // return {
    //   score: 0,
    //   maxScore: 400,
    //   classificacao: "Seguro",
    //   analise: "prototipo inicial da analise de link",
    //   riscos: [],
    //   recomendacao: "nenhuma ação necessaria"
  

export default new PrintAnalysisService();