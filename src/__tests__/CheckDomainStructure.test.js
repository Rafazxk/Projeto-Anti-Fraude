import CheckDomainStructure from "../domain/rules/link/CheckDomainStructure.js";

describe("CheckDomainStructure", () => {
  let rule;

  beforeEach(() => {
    rule = new CheckDomainStructure();
  });

  test("Deve pontuar corretamente um domínio .xyz com muitos hífens", async () => {
    const context = { domain: "login-seguro-atualizar-dados.xyz" };
    const result = await rule.execute(context);

    // 40 (xyz) + 25 (hífens > 2) = 65
    expect(result.pontuacao).toBe(65);
    expect(result.mensagem).toContain(".xyz");
    expect(result.mensagem).toContain("hífens");
  });

  test("Deve retornar null para um domínio nacional limpo", async () => {
    const context = { domain: "google.com.br" };
    const result = await rule.execute(context);
    expect(result).toBeNull();
  });
});