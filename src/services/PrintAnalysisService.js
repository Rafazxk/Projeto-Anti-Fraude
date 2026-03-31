import crypto from 'crypto';
import fs from 'fs';
import { extractTextFromImage } from "../utils/ocr.js";
import PrintFraudEngine from "../domain/engines/PrintFraudEngine.js";
import PrintRepository from "../repositories/PrintRepository.js";

class PrintAnalysisService {
  async execute({ image_path }) { // Removido user_id daqui, o Controller cuida disso
    if (!image_path) {
      throw new Error("A imagem é obrigatória.");
    }

    try {
      // 1. Gerar Hash para evitar reprocessar a mesma imagem (Economiza OCR)
      const imageBuffer = fs.readFileSync(image_path);
      const id_hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

      // 2. Verificar se já analisamos essa imagem antes
      const analiseExistente = await PrintRepository.findByHash(id_hash);
      
      if (analiseExistente) {
        console.log("--- [SERVICE] Imagem já conhecida, retornando cache ---");
        return this.formatResponse({
          score: analiseExistente.score_risco,
          classificacao: analiseExistente.tipo_golpe,
          fatores: []
        }, id_hash);
      }

      // 3. OCR - Extração de texto (Onde deu o log do "Olá, Boa tarde")
      const text = await extractTextFromImage(image_path);
      console.log("debug - texto extraído do print:", text);
      
      // 4. Engine de Fraude - Inteligência
      const result = PrintFraudEngine.analyze(text);

      // 5. Retornar apenas os dados processados
      // O Controller se encarregará de chamar PrintRepository.save() e ConsultaRepository.create()
      return this.formatResponse({
        score: result.score,
        classificacao: result.classificacao,
        fatores: result.fatoresDetectados,
        texto_extraido: text // Adicionado para o Controller poder salvar
      }, id_hash);

    } catch (error) {
      console.error("[PrintService Error]:", error);
      throw new Error("Erro ao processar inteligência da imagem.");
    }
  }

  formatResponse(dados, id_hash) {
    const { score, classificacao, fatores, texto_extraido } = dados;

    const alertasHumanos = (fatores || []).map(f => {
      const termo = f.toString().toLowerCase();
      if (termo.includes("urgencia")) return "Pressão psicológica para agir rápido.";
      if (termo.includes("dinheiro") || termo.includes("pix")) return "Solicitação de transferência de valores.";
      if (termo.includes("banco")) return "Tentativa de se passar por instituição financeira.";
      return "Padrão suspeito detectado.";
    });

    return {
      id_hash,
      texto_extraido, // Passando adiante para o Controller salvar no banco
      score: Number(score),
      classificacao: classificacao,
      alertas: [...new Set(alertasHumanos)],
      conclusao: this.buildConclusion(Number(score), classificacao)
    };
  }

  buildConclusion(score, classificacao) {
    if (classificacao === "Comprovante Detectado") return "Documento de transação identificado. Verifique seu saldo.";
    if (classificacao === "Golpe" || score >= 100) return "BLOQUEIE O CONTATO. Identificamos padrões claros de golpe.";
    if (classificacao === "Suspeito" || score >= 50) return "ATENÇÃO: Elementos suspeitos detectados. Não forneça dados.";
    return "Não detectamos riscos imediatos nesta imagem.";
  }
}

export default new PrintAnalysisService();