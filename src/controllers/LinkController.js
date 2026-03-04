import LinkAnalysisService from "../services/LinkAnalysisService.js";

class LinkController {
  async analyze(req, res) {
    try{
    const { url } = req.body;
    
    const result = await LinkAnalysisService.execute({ url });
    
    console.log("resultado controller: ", result);
    
    return res.status(200).json(result);
  } catch(error) {
    return res.status(400).json({ error: error.message });
  } 
 }
}

export default new LinkController();