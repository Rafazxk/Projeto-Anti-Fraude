import NumverifyClient from "../../../integrations/NumverifyClient.js";

class CheckNumverifyRule {
  async execute(numero){
    const data = await NumverifyClient.validate(numero);
    
    if(!data.valid){
      return {
        score:70,
        message:"número inválido."
      };
    }
    
    return null;
  }
}

export default CheckNumverifyRule;