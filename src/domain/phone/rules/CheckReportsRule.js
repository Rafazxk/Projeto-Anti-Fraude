// denuncias internas 
 import PhoneReportsRepository from "../../../repositories/PhoneReportsRepository.js";
 
 class CheckReportsRule {
    
     async execute(numero){
        const reports = await PhoneReportsRepository.countReports(numero);
       
       if(reports >= 10) {
         return { score:70, message:"número possui muitas denúncias." };
       }
       
       if(reports >= 3) {
         return { score:40, message:"número possui várias denúncias." };
       }
       
       if(reports >= 1) {
         return { score:40, message:"número possui denúncia registrada." };
       }
       return null;
     }
 }
 
  export default CheckReportsRule;