class RiskClassifier {
  execute(score) {
    console.log("calculando classificação para score: ", score);
    if(score >= 80) return "Alto risco";
    if (score >= 50) return "Médio risco";
    return "Golpe";
  }
}

export default RiskClassifier;