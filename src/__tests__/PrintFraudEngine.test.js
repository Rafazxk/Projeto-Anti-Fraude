import PrintFraudEngine from '../domain/engines/PrintFraudEngine.js';

describe('PrintFraudEngine - Lógica de Análise', () => {
  
  test('Deve detectar um golpe clássico com score alto', () => {
    const texto = "ME MANDA UM PIX AGORA URGENTE OU VOU BLOQUEAR SUA CONTA";
    const result = PrintFraudEngine.analyze(texto);
    
    expect(result.score).toBeGreaterThanOrEqual(100);
    expect(result.classificacao).toBe('Golpe');
  });

  test('Deve classificar comprovantes legítimos como Comprovante Detectado', () => {
    const texto = "Pronto! Seu pagamento foi realizado. Comprovante do Pix";
    const result = PrintFraudEngine.analyze(texto);
    
    expect(result.classificacao).toBe('Comprovante Detectado');
    expect(result.score).toBeLessThan(50);
  });

  test('Deve classificar conversas neutras como Seguro', () => {
    const texto = "Oi mãe, tudo bem? Vamos almoçar amanhã?";
    const result = PrintFraudEngine.analyze(texto);
    
    expect(result.classificacao).toBe('Seguro');
    expect(result.score).toBe(0);
  });

});