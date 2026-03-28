import pkg from 'google-libphonenumber';
const {PhoneNumberUtil} = pkg;

const phoneUtil = PhoneNumberUtil.getInstance();

class ValidateFormatRule {
  async execute(numero) {
    try {
      // 1. Limpa e prepara o número
      // Importante: a lib precisa do "+" ou do código do país para validar bem
      let numeroParaValidar = numero.replace(/\D/g, '');
      if (!numeroParaValidar.startsWith('+')) {
        numeroParaValidar = '+' + numeroParaValidar;
      }

      // 2. Tenta parsear o número
      const numberProto = phoneUtil.parse(numeroParaValidar);

      // 3. Verifica se o número é logicamente possível e válido para o país
      const isValid = phoneUtil.isValidNumber(numberProto);
      const numberType = phoneUtil.getNumberType(numberProto); // Fixo, Celular, etc.

      if (!isValid) {
        return { 
          score: 70, 
          message: "O formato do número é impossível ou inexistente." 
        };
      }

      // Opcional: Você pode dar pontos extras se for um tipo suspeito (ex: Premium Rate)
      // const PNT = i18n.phonenumbers.PhoneNumberType;
      // if (numberType === PNT.PREMIUM_RATE) score += 30;

      return { score: 0, message: null };

    } catch (error) {
      // Se der erro no parse, o número é estruturalmente inválido
      return { 
        score: 70, 
        message: "Número inválido: formato internacional não reconhecido." 
      };
    }
  }
}

export default ValidateFormatRule;