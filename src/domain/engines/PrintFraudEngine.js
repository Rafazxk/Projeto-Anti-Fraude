class PrintFraudEngine {
  analyze(text) {
    const cleanText = (text || "").toString().toLowerCase();
    let score = 0;
    let fatoresDetectados = [];

    const dicionario = [
      { termo: 'urgente', peso: 40, label: 'urgencia' },
      { termo: 'agora', peso: 30, label: 'urgencia' },
      { termo: 'pix', peso: 50, label: 'dinheiro' },
      { termo: 'código', peso: 60, label: 'codigo' },
      { termo: 'banco', peso: 30, label: 'banco' }
    ];

    dicionario.forEach(item => {
      if (cleanText.includes(item.termo)) {
        score += item.peso;
        if (!fatoresDetectados.includes(item.label)) {
          fatoresDetectados.push(item.label);
        }
      }
    });

    if (this.containsBankImpersonation(cleanText)) score += 20;

    let classificacaoFinal = score >= 100 ? "Golpe" : (score >= 50 ? "Suspeito" : "Seguro");

    // REFORÇO NA DETECÇÃO DE COMPROVANTE
    const termosComprovante = ["comprovante", "comprovante de", "transação"];
    const termosSucesso = ["realizado", "pago", "sucesso", "concluída"];

    const ehComprovante = termosComprovante.some(t => cleanText.includes(t)) && 
                          termosSucesso.some(s => cleanText.includes(s));

    if (ehComprovante) {
      classificacaoFinal = "Comprovante Detectado";
      score = 0; 
    }

    return {
      score,
      classificacao: classificacaoFinal,
      fatoresDetectados
    };
  }
  // --- Funções Auxiliares (Fora do analyze, mas dentro da classe) ---

  containsUrgency(text) {
    return text.includes("urgente") || text.includes("agora") || text.includes("imediatamente");
  }

  containsMoneyRequest(text) {
    return text.includes("pix") || text.includes("transferência") || text.includes("manda dinheiro");
  }

  containsCodeRequest(text) {
    return text.includes("código") || text.includes("verificação");
  }

  containsBankImpersonation(text) {
    const termosBanco = ["sou do banco", "central do banco", "senha do banco", "código do banco"];
    return termosBanco.some(termo => text.includes(termo));
  }
}

export default new PrintFraudEngine();