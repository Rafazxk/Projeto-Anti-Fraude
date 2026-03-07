// 1 - normalizar texto
// 2 - detectar fatores psicologicos 
// 3 - detectar padroes classicos 
// 4 - detectar combinações criticas
// 5 - classificar 
// 6 - gerar resposta humana

//upload de imagen

// ocr - extrair o texto

//motor de analise psicologica

//score + classificação + resposta

//tesseract.js - biblioteca

class PrintFraudEngine {
  analyze(text){
    
     const normalized = text.toLowerCase();
     
     let score = 0;
     const maxScore = 200;
     const fatoresDetectados = [];
    const combinacao = 50;
    //fatores psicologicos 
    
    //urgencia 
    //dinheiro
    //banco 
    //codigo
    
    if(this.containsUrgency(normalized)){
      score += 25;
      fatoresDetectados.push("Urgencia: ", score);
    }
    
    if(this.containsMoneyRequest(normalized)){
      score += 50;
      fatoresDetectados.push("pedido de dinheiro: ", score);
    }
    
    if(this.containsCodeRequest(normalized)){
      score += 60;
      fatoresDetectados.push("pedido de código: ", score);
    }
    if(this.containsBankImpersonation(normalized)){
        score += 60;
        fatoresDetectados.push("se passando por banco: ", score);
      }
      
    //combinações
    //combinação +50 
    // score + 50(combinação)
    if(this.containsUrgency(normalized) && this.containsMoneyRequest(normalized)){
      score += 50;
      score +=combinacao;
      
      fatoresDetectados.push("combinação critica: urgencia + dinheiro", score);
    }
    
    if(this.containsCodeRequest(normalized) && this.containsBankImpersonation(normalized)){
      score += 60;
      score+=combinacao;
      fatoresDetectados.push("combinação critica: código + banco", score);
    }
    
    //classificação
    
    let classificacao = "";
    
    if(score >= 150){
      classificacao = "Golpe";
    } else if (score >= 80) {
      classificacao = "Suspeito";
    } else if (score < 80 ){
      classificacao = "Seguro";
    }
    return {
      score,
      maxScore,
      classificacao,
      fatoresDetectados
    };
  }
  
  //urgencia 
  containsUrgency(text){
    return text.includes("urgente") || text.includes("agora") || text.includes("imediatamente");
  }
  //dinheiro
  containsMoneyRequest(text){
    return text.includes("pix") || text.includes("transferẽncia")  || text.includes("manda dinheiro");
  }
  // codigo de verificacao
  containsCodeRequest(text){
    return text.includes("código") || text.includes("código de verificação");
  }
  //banco
  containsBankImpersonation(text){
    return text.includes("sou do banco") || text.includes("central do banco")
      || text.includes("senha do banco")
      || text.includes("banco") 
      || text.includes("código do banco");
  }
}

export default new PrintFraudEngine();