import PrintAnalysisService from "../services/PrintAnalysisService.js";

class PrintController{
  async analyze(req, res){
    try{
      const result = await PrintAnalysisService.execute();
      
      return res.status(200).json(result);
    }catch(error){
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new PrintController();