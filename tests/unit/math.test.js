import { describe, it, expect } from "vitest";
import { calcularResposta } from "../../src/core/math.js";

describe("calcularResposta", () => {
  it("deve somar dois números", () => {
    expect(calcularResposta(2, "+", 3)).toBe(5);
  });

  it("deve subtrair dois números", () => {
    expect(calcularResposta(7, "-", 4)).toBe(3);
  });

  it("deve multiplicar dois números", () => {
    expect(calcularResposta(3, "*", 4)).toBe(12);
  });

  it("deve dividir dois números", () => {
    expect(calcularResposta(8, "/", 2)).toBe(4);
  });

  it("deve rejeitar divisão por zero", () => {
    expect(() => calcularResposta(8, "/", 0))
      .toThrow("Divisão por zero não é permitida.");
  });
});