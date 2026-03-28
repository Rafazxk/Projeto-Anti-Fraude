import { jest } from '@jest/globals';

// 1. Mock do Repositório (Nome da função deve ser EXATO ao usado na Regra)
jest.unstable_mockModule("../repositories/BlacklistRepository.js", () => ({
  default: {
    findByDomain: jest.fn() // <-- Mudei de findAllDomains para findByDomain
  }
}));

// 2. Mock do Fetch Global
global.fetch = jest.fn();

// 3. Imports Dinâmicos
const { default: LinkAnalysisService } = await import("../services/LinkAnalysisService.js");
const { default: BlacklistRepository } = await import("../repositories/BlacklistRepository.js");

describe("LinkAnalysisService - Integração", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Deve somar as pontuações corretamente", async () => {
    // Simula que o domínio NÃO está na blacklist
    BlacklistRepository.findByDomain.mockResolvedValue(null);

    // Simula domínio novo (2 dias)
    const dataRecente = new Date();
    dataRecente.setDate(dataRecente.getDate() - 2);
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ created: dataRecente.toISOString() })
    });

    const result = await LinkAnalysisService.execute({ url: "https://itau-login.xyz" });

    expect(result).toBeDefined();
    // Typosquatting (100) + Structure (40) + Age (100) = 240
    expect(result.score).toBeGreaterThanOrEqual(240);
  });
});