class ScoreCalculator {
  execute(results) {
    return results.reduce((acc, rule) => {
      if (!rule) return acc;
      return acc + rule.pontuacao;
    }, 0);
  }
}

export default ScoreCalculator;