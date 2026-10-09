export function calcularResposta(a, operacao, b) {
  switch (operacao) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      if (b === 0) {
        throw new Error("Divisão por zero não é permitida.");
      }

      return a / b;

    default:
      throw new Error("Operação inválida.");
  }
}