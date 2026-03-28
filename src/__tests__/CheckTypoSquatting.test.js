import CheckTyposquatting from "../domain/rules/link/checkTyposquatting.js";

describe("CheckTyposquatting", () => {
  let rule;

  beforeEach(() => {
    rule = new CheckTyposquatting();
  });

  test("Deve detectar 'itau' escondido em subdomínio", async () => {
    const context = { domain: "itau.suporte-tecnico.net" };
    const result = await rule.execute(context);
    expect(result.pontuacao).toBe(100);
    expect(result.mensagem).toContain("itau");
  });

  test("Deve detectar similaridade visual (Levenshtein) como 'g00gle'", async () => {
    const context = { domain: "g00gle.com" };
    const result = await rule.execute(context);
    expect(result.pontuacao).toBeGreaterThan(0);
  });

  test("Não deve marcar o domínio oficial como fraude", async () => {
    const context = { domain: "nubank.com.br" };
    const result = await rule.execute(context);
    expect(result).toBeNull();
  });
});