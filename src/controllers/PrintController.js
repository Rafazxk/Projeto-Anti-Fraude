import PrintAnalysisService from "../services/PrintAnalysisService.js";

class PrintController{
  async analyze(req, res){
    try{
      const image_path = req.file.path;
      
      const result = await PrintAnalysisService.execute({image_path});
      
      return res.json(result);
    }catch(error){
      console.error(error);
      
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new PrintController();