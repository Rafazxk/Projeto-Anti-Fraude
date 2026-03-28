import CheckDomainAge from "../domain/rules/link/checkDomainAge.js";
import { jest } from '@jest/globals';

describe("CheckDomainAge", () => {
  let rule;

  beforeEach(() => {
    rule = new CheckDomainAge();
    // Simula o fetch global
    global.fetch = jest.fn();
  });

  test("Deve dar 100 pontos para domínio com menos de 7 dias", async () => {
    const dataCriacao = new Date();
    dataCriacao.setDate(dataCriacao.getDate() - 3); // 3 dias atrás

    // Mock da resposta da API
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ created: dataCriacao.toISOString() })
    });

    const context = { domain: "site-novo.com" };
    const result = await rule.execute(context);

    expect(result.pontuacao).toBe(100);
    expect(result.mensagem).toContain("extremamente recente");
  });

  test("Deve retornar null se a API falhar", async () => {
    global.fetch.mockRejectedValue(new Error("API Offline"));
    
    const context = { domain: "qualquer-site.com" };
    const result = await rule.execute(context);
    expect(result).toBeNull();
  });
});