// import ConsultaService from "../services/consultaService.js";
// import ConsultaRepository from "../repositories/ConsultaRepository.js";

// class ConsultaController {

//   async criar(req, res) {
//     try {
//       const { user_id, tipo_consulta, conteudo } = req.body;

//       const consulta = await ConsultaService.criarConsulta({
//         user_id,
//         tipo_consulta,
//         conteudo
//       });

//       return res.status(201).json(consulta);
//     } catch (error) {
//       console.log("passou por aqui");
//       console.error("Erro ao criar consulta:", error);
//       return res.status(400).json({ error: error.message });
//     }
//   }

//   async listar(req, res) {
//     try {
//       const { user_id } = req.query;

//       if (!user_id) {
//         return res.status(400).json({ error: "user_id é obrigatório" });
//       }

//       const consultas = await ConsultaRepository.findAllByUser(user_id);

//       return res.status(200).json(consultas);

//     } catch (error) {
//       console.log("erro aqui no controller");
//       return res.status(500).json({ error: error.message });
//     }
//   }
// }

// export default new ConsultaController();