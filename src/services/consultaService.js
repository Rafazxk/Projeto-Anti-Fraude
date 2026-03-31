import CheckBlacklist from "../domain/rules/link/CheckBlacklist.js";
import CheckDomainStructure from "../domain/rules/link/CheckDomainStructure.js";
import ScoreCalculator from "../domain/scoring/ScoreCalculator.js";
import RiskClassifier from "../domain/classification/RiskClassifier.js";
import BlacklistRepository from "../repositories/BlacklistRepository.js";
import ConsultaRepository from "../repositories/ConsultaRepository.js";
import Logger from "../utils/logger.js";

class ConsultaService {

  async criarConsulta({ user_id, tipo_consulta, conteudo }) {
    console.log("--- [SERVICE] PASSO 1: Entrou na função ---");
    
    try {
      const dominio = this.extrairDominio(conteudo);
      console.log("--- [SERVICE] PASSO 2: Domínio extraído:", dominio);

      if (!dominio) {
        return { score: 0, nivel: "URL inválida" };
      }

      // 1. Executar Regras
      const regras = [
        new CheckBlacklist(BlacklistRepository),
        new CheckDomainStructure()
      ];

      const regrasAtivadas = [];
      for (const regra of regras) {
        const resultadoRegra = await regra.execute(dominio);
        if (resultadoRegra) {
          regrasAtivadas.push(resultadoRegra);
        }
      }
      console.log("--- [SERVICE] PASSO 3: Regras processadas ---");

      // 2. Calcular Score
      const scoreCalc = new ScoreCalculator();
      const score = scoreCalc.execute(regrasAtivadas);
      console.log("--- [SERVICE] PASSO 4: Score obtido:", score);

      // 3. Classificar Risco
      const riskClass = new RiskClassifier();
      const nivel = riskClass.execute(score);
      console.log("--- [SERVICE] PASSO 5: Nível classificado:", nivel);

      // 4. Salvar no Banco
      console.log("--- [SERVICE] PASSO 6: Tentando salvar no Repository ---");
      const consulta = await ConsultaRepository.create({
        user_id,
        tipo_consulta,
        score_risco: score,
        resultado: nivel
      });

      console.log("--- [SERVICE] PASSO 7: Sucesso total! ID:", consulta?.id);

      return { score, nivel };

    } catch (error) {
      console.error("--- [SERVICE] ERRO FATAL DENTRO DO SERVICE ---");
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      throw error; // Repassa para o Controller ver
    }
  }

  extrairDominio(url) {
    try {
      if (!url) return null;
      const urlFormatada = url.includes("://") ? url : `http://${url}`;
      const parsed = new URL(urlFormatada);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }
}

export default new ConsultaService();