import NumverifyClient from "../../../integrations/NumverifyClient.js";


class CheckNumverifyRule {
  async execute(numero) {
  try {
    const data = await NumverifyClient.validate(numero);
    
    // Se a API retornou erro de sistema (Chave, Limite, etc), NÃO PONTUA
    if (data.success === false || data.error) {
      console.warn("⚠️ Numverify Error:", data.error ? data.error.type : "Unknown");
      return { score: 0, message: null }; 
    }

    // Só pontuamos 70 se a API funcionar e disser explicitamente que o número é INVÁLIDO
    if (data.valid === false) {
      return {
        score: 70,
        message: "A operadora informa que este número é inexistente."
      };
    }

    return { score: 0, message: null };
  } catch (e) {
    return { score: 0, message: null };
  }
}
}

export default CheckNumverifyRule;