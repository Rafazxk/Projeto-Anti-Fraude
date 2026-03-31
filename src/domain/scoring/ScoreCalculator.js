class ScoreCalculator {
  execute(results) {
    if(!results || !Array.isArray(results)) return 0;
    return results.reduce((acc, rule) => {
      if (!rule) return acc;
      return acc + rule.pontuacao;
    }, 0);
  }
}

export default ScoreCalculator;