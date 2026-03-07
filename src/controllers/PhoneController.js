import PhoneAnalysisService from "../services/PhoneAnalysisService.js";

class PhoneController {
  async analyze(req, res){
    try{
      const { numero } = req.body;
      
      const result = await PhoneAnalysisService.execute({ numero});
      
       console.log("resultado PhoneController: ", result);
      
      return res.status(200).json(result);
    }catch(error){
       return res.status(400).json({ error: error.message });
    }
  }
}

export default new PhoneController();