import axios from "axios";

class ValidateNumberRule {
  async execute(numero) {

    let score = 0
    let motivos = []

    try {

      const response = await axios.get(
        `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_KEY}&number=${numero}`
      )

      const data = response.data

      if (!data.valid) {
        score += 70
        motivos.push("Número inválido")
      }

      if (data.line_type === "voip") {
        score += 40
        motivos.push("Número virtual")
      }

      if (data.country_code !== "BR") {
        score += 35
        motivos.push("País suspeito")
      }

    } catch (error) {
      console.log("Erro ao validar telefone:", error.message)
    }

    return {
      score,
      motivos
    }
  }
}

export default ValidateNumberRule;