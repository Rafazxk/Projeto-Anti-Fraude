class LinkAnalysisService{
  async execute({ url }) {
    if(!url){
      throw new Error("URL é obrigatoria");
    }
    
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

export default new LinkAnalysisService();