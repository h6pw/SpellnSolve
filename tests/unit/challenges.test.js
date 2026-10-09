import { describe, it, expect, vi } from "vitest";
import { gerarDesafio } from "../../src/core/challenges.js";

describe("gerarDesafio", () => {
  it('gera divisão inteira ao selecionar explicitamente a operação', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    try { const desafio=gerarDesafio('dificil');expect(desafio.operacao).toBe('/');expect(desafio.b).toBeGreaterThan(0);expect(Number.isInteger(desafio.resposta)).toBe(true); }
    finally { random.mockRestore(); }
  });
  it.each([['medio', 20, 0.9], ['dificil', 99, 0.6]])('limita multiplicação em %s a dois dígitos por um', (difficulty, maxA, operationRandom) => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    random.mockReturnValueOnce(operationRandom);
    try {
      const challenge = gerarDesafio(difficulty);
      expect(challenge.operacao).toBe('*');
      expect(challenge.a).toBe(maxA); expect(challenge.b).toBe(9);
      expect(challenge.resposta).toBe(maxA * 9);
    } finally { random.mockRestore(); }
  });
  it('divisões têm resto zero sem divisor 1 ou resposta 1', () => {
    const random = vi.spyOn(Math, 'random');
    try {
      for (const edge of [0, 0.5, 0.99]) {
        random.mockReturnValue(edge).mockReturnValueOnce(0.99);
        const challenge = gerarDesafio('dificil');
        expect(challenge.operacao).toBe('/');expect(challenge.a % challenge.b).toBe(0);
        expect(challenge.b).toBeGreaterThanOrEqual(2);expect(challenge.resposta).toBeGreaterThanOrEqual(2);
        expect(challenge.a).toBeLessThanOrEqual(99);
      }
    } finally { random.mockRestore(); }
  });
  it("deve gerar um desafio fácil válido", () => {
    const desafio = gerarDesafio("facil");

    expect(["+", "-"]).toContain(desafio.operacao);
    expect(Number.isFinite(desafio.resposta)).toBe(true);
  });

  it("deve gerar um desafio médio válido", () => {
    const desafio = gerarDesafio("medio");

    expect(["+", "-", "*"]).toContain(desafio.operacao);
    expect(Number.isFinite(desafio.resposta)).toBe(true);
  });

  it("deve gerar um desafio difícil válido", () => {
    const desafio = gerarDesafio("dificil");

    expect(["+", "-", "*", "/"]).toContain(desafio.operacao);
    expect(Number.isInteger(desafio.resposta)).toBe(true);
  });

  it("não deve aceitar uma dificuldade inexistente", () => {
    expect(() => gerarDesafio("impossivel"))
      .toThrow("Dificuldade inválida.");
  });

  it("deve respeitar os limites de cada dificuldade", () => {
    const dificuldades = {
      facil: 20,
      medio: 50,
      dificil: 99,
    };

    for (const [dificuldade, maximo] of Object.entries(dificuldades)) {
      for (let i = 0; i < 100; i++) {
        const desafio = gerarDesafio(dificuldade);

        expect(desafio.a).toBeGreaterThanOrEqual(1);
        expect(desafio.a).toBeLessThanOrEqual(maximo);

        expect(desafio.b).toBeGreaterThanOrEqual(1);
        expect(desafio.b).toBeLessThanOrEqual(maximo);
      }
    }
  });
});
