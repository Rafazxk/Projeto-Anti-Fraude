import PhoneReportsRepository from "../../../repositories/PhoneReportsRepository.js";

class CheckReportsRule {
  async execute(numero) {
    const res = await PhoneReportsRepository.countReports(numero);
    
    const count = parseInt(res) || 0; 

    if (count === 0) {
      return { score: 0, message: null };
    }

   console.log("numero de denuncias: ", count);

    if (count >= 5) {
      return { score: 100, message: "Muitas denúncias vinculadas a este número!" };
    }
    
    return { score: 20, message: `Este número possui ${count} denúncia(s) no sistema.` };
}
}

export default CheckReportsRule;