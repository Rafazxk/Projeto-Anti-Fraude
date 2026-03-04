class PrintAnalysisService{
  async execute() {
    return {
      score: 0,
      maxScore: 400,
      classificacao: "Seguro",
      analise: "prototipo inicial da analise de link",
      riscos: [],
      recomendacao: "nenhuma ação necessaria"
    };
  }
}

export default new PrintAnalysisService();