import LinkAnalysisService from '../services/LinkAnalysisService.js';
import PhoneAnalysisService from '../services/PhoneAnalysisService.js';
import PrintAnalysisService from '../services/PrintAnalysisService.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';
import PrintRepository from '../repositories/PrintRepository.js';

class ConsultaController {

  processarAnalise = async (req, res, tipo) => {
    console.log("iniciando analise do  tipo: ", tipo, req.body);
    try {
      const user_id = req.user.id;
      let resultadoMotor;

      // 1. Decisão de qual motor acionar (Apenas inteligência)
      switch (tipo) {
        case 'link':
          resultadoMotor = await LinkAnalysisService.execute({ url: req.body.url });
          break;
        case 'telefone':
          resultadoMotor = await PhoneAnalysisService.execute({ numero: req.body.numero });
          break;
        case 'print':
          resultadoMotor = await PrintAnalysisService.execute({ image_path: req.file.path });
          break;
        default:
          throw new Error("Tipo de consulta inválido");
      }
   console.log("[BANCO] enviando para o banco ", tipo);
   
      const novaConsulta = await ConsultaRepository.create({
        user_id,
        tipo_consulta: tipo,
        score_risco: resultadoMotor.score,
        resultado: resultadoMotor.classificacao || resultadoMotor.nivel
      });

     
      if (tipo === 'print') {
        try {
          const jaExiste = await PrintRepository.findByHash(resultadoMotor.id_hash);
          if (!jaExiste) {
            await PrintRepository.save({
              id_hash: resultadoMotor.id_hash,
              consulta_id: novaConsulta.id, 
              caminho_arquivo: req.file.path,
              texto_extraido: resultadoMotor.texto_extraido,
              tipo_golpe: resultadoMotor.classificacao,
              score_risco: resultadoMotor.score
            });
          }
        } catch (err) {
          console.warn("Aviso: Falha ao salvar detalhes do print, mas a consulta foi gravada.");
        }
      }

      // 4. Resposta para o Frontend
      return res.json({
        score: resultadoMotor.score,
        classificacao: resultadoMotor.classificacao || resultadoMotor.nivel,
        conclusao: resultadoMotor.conclusao || (resultadoMotor.score >= 60 ? "Risco Detectado" : "Parece Seguro")
      });

    } catch (error) {
      console.error(`Erro na análise de ${tipo}:`, error);
      res.status(400).json({ error: error.message });
    }
  }

  // Handlers
  analisarLink = (req, res) => this.processarAnalise(req, res, 'link');
  analisarTelefone = (req, res) => this.processarAnalise(req, res, 'telefone');
  analisarPrint = (req, res) => this.processarAnalise(req, res, 'print');

  obterHistorico = async (req, res) => {
    try {
      const user_id = req.user.id;
      const consultas = await ConsultaRepository.findAllByUser(user_id);
      
      const historicoFormatado = consultas.map(c => ({
        data: c.data_consulta ? new Date(c.data_consulta).toLocaleDateString('pt-BR') : 'N/A',
        alvo: c.tipo_consulta, 
        resultado: c.resultado || 'Indefinido'
      }));
    
      return res.json(historicoFormatado);
    } catch (error) {
      console.error("Erro no Histórico:", error);
      return res.status(500).json({ error: "Erro interno ao buscar histórico" });
    }
  }
}

export default new ConsultaController();