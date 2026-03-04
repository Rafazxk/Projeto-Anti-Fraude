import CheckBlacklist from "../domain/rules/link/CheckBlacklist.js";
import CheckDomainStructure from "../domain/rules/link/CheckDomainStructure.js";
import ScoreCalculator from "../domain/scoring/ScoreCalculator.js";
import RiskClassifier from "../domain/classification/RiskClassifier.js";
import BlacklistRepository from "../repositories/BlacklistRepository.js";
import ConsultaRepository from "../repositories/ConsultaRepository.js";
import ConsultaDetalhesRepository from "../repositories/ConsultaDetalhesRepository.js";
import Logger from "../utils/logger.js";

class ConsultaService {

  async criarConsulta({ user_id, tipo_consulta, conteudo }) {

    Logger.info("ConsultaService", "Iniciando criação de consulta");

    const dominio = this.extrairDominio(conteudo);

    if (!dominio) {
      return {
        score: 0,
        nivel: "URL inválida"
      };
    }

    console.log("DOMINIO EXTRAIDO:", dominio);

    
    const regras = [
      new CheckBlacklist(BlacklistRepository),
      new CheckDomainStructure()
    ];

    const regrasAtivadas = [];

    for (const regra of regras) {
      const resultado = await regra.execute(dominio);
      if (resultado) {
        regrasAtivadas.push(resultado);
      }
    }
    
    console.log("regras ativadas: ", regrasAtivadas);
    
    const scoreCalculator = new ScoreCalculator();
    const score = scoreCalculator.execute(regrasAtivadas);

    const riskClassifier = new RiskClassifier();
    const nivel = riskClassifier.execute(score);

    const consulta = await ConsultaRepository.create({
      user_id,
      tipo_consulta,
      score_risco: score,
      resultado: nivel
    });

    for (const detalhe of regrasAtivadas) {
      await ConsultaDetalhesRepository.salvarDetalhe({
        consulta_id: consulta.consulta_id,
        regra_ativada: detalhe.regra,
        pontuacao: detalhe.pontuacao,
        mensagem: detalhe.mensagem
      });
    }

    Logger.info("ConsultaService", `Consulta salva com ID ${consulta.consulta_id}`);

    return {
      score,
      nivel
    };
  }

  extrairDominio(url) {
    try {
      if (!url || typeof url !== "string") return null;

      const urlLimpa = url.trim();

      const urlFormatada = urlLimpa.startsWith("http")
        ? urlLimpa
        : `http://${urlLimpa}`;

      const parsedUrl = new URL(urlFormatada);

      let hostname = parsedUrl.hostname
        .toLowerCase()
        .replace(/^www\./, "")
        .trim();

      hostname = hostname.split(":")[0];
      hostname = hostname.replace(/\.$/, "");

      return hostname || null;

    } catch {
      return null;
    }
  }
}

export default new ConsultaService();