import crypto from 'crypto';
import fs from 'fs';
import { extractTextFromImage } from "../utils/ocr.js";
import PrintFraudEngine from "../domain/engines/PrintFraudEngine.js";
import PrintRepository from "../repositories/PrintRepository.js";

class PrintAnalysisService {
  async execute({ image_path, userId }) {

    if (!image_path) {
      throw new Error("A imagem é obrigatória.");
    }
  
   console.log("image_path", image_path);
   
    try {
      // 1. Gerar Hash da imagem para busca rápida e cache
      const imageBuffer = fs.readFileSync(image_path);
      const id_hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

      // 2. Tentar buscar se esta imagem já foi analisada antes
      const analiseExistente = await PrintRepository.findByHash(id_hash);
      
      if (analiseExistente) {
        // Se já existe, apenas vinculamos a consulta ao usuário atual (se houver userId)
        if (userId) await PrintRepository.registrarNovaConsultaParaHash(id_hash, userId);
        
        // Mapeamos os nomes do banco (score_risco) para o formato do Front (score)
        return this.formatResponse({
          score: analiseExistente.score_risco,
          classificacao: analiseExistente.tipo_golpe,
          fatores: [] // Como o banco atual não salva fatores separadamente, passamos vazio ou tratamos
        }, id_hash);
      }

      // 3. Processo de análise nova (OCR + Engine)
      const text = await extractTextFromImage(image_path);
      
      console.log("debug - texto extraído do print:", text);
      
      // const text = "URGENTE PIX AGORA BLOQUEIO BANCO";
      
      const result = PrintFraudEngine.analyze(text);

      // 4. Fluxo de Banco de Dados seguindo seu Schema
      // Primeiro, criamos a entrada na tabela 'consultas' para obter o ID necessário
      const consulta_id = await PrintRepository.criarConsulta('0586eae6-c976-4d1a-85ac-a2c9339bc763');

      // Segundo, salvamos na 'prints_analisados' usando suas colunas exatas
      const novaAnaliseDB = {
        id_hash,
        consulta_id,
        caminho_arquivo: image_path,
        texto_extraido: text,
        tipo_golpe: result.classificacao, // 'Golpe', 'Suspeito', 'Seguro'
        score_risco: result.score
      };

      await PrintRepository.save(novaAnaliseDB);

      // 5. Retorno Padronizado
      return this.formatResponse({
        score: result.score,
        classificacao: result.classificacao,
        fatores: result.fatoresDetectados
      }, id_hash);

    } catch (error) {
      console.error("[PrintService Error]:", error);
      throw new Error("Erro ao processar imagem no banco de dados.");
    }
  }

  formatResponse(dados, id_hash) {
    const { score, classificacao, fatores } = dados;

    const alertasHumanos = (fatores || []).map(f => {
      const termo = f.toString().toLowerCase();
      if (termo.includes("urgencia")) return "Pressão psicológica para agir rápido.";
      if (termo.includes("dinheiro") || termo.includes("pix")) return "Solicitação de transferência de valores.";
      if (termo.includes("código")) return "Pedido suspeito de códigos de segurança.";
      if (termo.includes("banco")) return "Tentativa de se passar por uma instituição financeira.";
      if (termo.includes("critica")) return "Combinação de alto risco detectada.";
      return "Padrão de conversa suspeito detectado.";
    });

    return {
      id_hash,
      status: "Análise Concluída",
      score: Number(score),
      classificacao: classificacao,
      alertas: [...new Set(alertasHumanos)],
      conclusao: this.buildConclusion(Number(score), classificacao)
    };
  }

  buildConclusion(score, classificacao) {
  if (classificacao === "Comprovante Detectado") {
    return "ocumento de transação identificado. Certifique-se de que o valor caiu na sua conta antes de entregar qualquer produto.";
  }
  if (classificacao === "Golpe" || score >= 100) {
    return "LOQUEIE O CONTATO. Identificamos padrões claros de golpe financeiro nesta imagem.";
  }
  if (classificacao === "Suspeito" || score >= 50) {
    return "ATENÇÃO: Esta conversa possui elementos suspeitos. Não forneça dados ou códigos.";
  }
  return "✅ão detectamos riscos imediatos nesta imagem.";
}
}

export default new PrintAnalysisService();