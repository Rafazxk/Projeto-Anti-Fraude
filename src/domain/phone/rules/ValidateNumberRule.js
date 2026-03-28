class ValidateNumberRule {
// No Backend (ValidateNumberRule.js)
execute(numero) {
  const apenasNumeros = numero.replace(/\D/g, '');
  
  // ACEITAR DE 10 A 15 DÍGITOS
  const regex = /^\d{10,15}$/; 

  if (!regex.test(apenasNumeros)) {
    return { score: 70, message: "Número com formato internacional ou local inválido." };
  }
  return { score: 0, message: null };
 }
}

export default ValidateNumberRule;