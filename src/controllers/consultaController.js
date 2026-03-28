import ConsultaService from "../services/consultaService.js";
import ConsultaRepository from "../repositories/ConsultaRepository.js";

class ConsultaController {
  
  analisarLink = async (req, res) => {
    console.log("chegou no controller")
    try {
      const { url } = req.body;
      
      // LOG DE DEPURAÇÃO: Verifique se o ID está chegando aqui
      console.log("ID do usuário no Controller:", req.user?.id);

      if (!url) {
        return res.status(400).json({ error: "A URL é obrigatória para análise." });
      }

      // O service.criarConsulta DEVE conter o await para garantir a inserção
      const resultado = await ConsultaService.criarConsulta({
        user_id: req.user.id, 
        tipo_consulta: 'LINK',
        conteudo: url
      });

      // Se o service retornar erro ou score nulo, trate aqui
      return res.json({
        score: resultado.score,
        classificacao: resultado.nivel,
        conclusao: resultado.score >= 60 
          ? "Atenção! Este link apresenta alto risco de fraude." 
          : "Este link parece seguro para navegação."
      });

    } catch (error) {
      console.error("Erro ao processar análise no Controller:", error);
      return res.status(400).json({ error: error.message });
    }
  }

 async obterHistorico(req, res) {
  try {
    const user_id = req.user.id;
    const consultas = await ConsultaRepository.findAllByUser(user_id);
    
    console.log("id do utilizador: ", user_id);
    console.log("tipo do id: ", typeof req.user.id);
    // O Dashboard.js geralmente procura por: data, alvo, resultado
    const historicoFormatado = consultas.map(c => ({
      // Use o nome exato da coluna do seu banco (data_consulta)
      data: c.data_consulta ? new Date(c.data_consulta).toLocaleDateString('pt-BR') : 'N/A',
      alvo: c.tipo_consulta || 'LINK', 
      resultado: c.resultado || 'Indefinido'
    }));

    console.log("Enviando histórico formatado:", historicoFormatado);
    return res.json(historicoFormatado);
  } catch (error) {
    console.error("Erro no Controller ao buscar histórico:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}
}

export default new ConsultaController();