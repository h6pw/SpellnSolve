import { describe, it, expect } from "vitest";
import { gerarDesafio } from "../../src/core/challenges.js";

describe("gerarDesafio", () => {
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
      facil: 10,
      medio: 20,
      dificil: 50,
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
