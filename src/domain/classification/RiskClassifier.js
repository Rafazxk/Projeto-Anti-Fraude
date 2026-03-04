class RiskClassifier {
  execute(score) {
    if (score <= 30) return "Seguro";
    if (score <= 60) return "Suspeito";
    return "Golpe";
  }
}

export default RiskClassifier;