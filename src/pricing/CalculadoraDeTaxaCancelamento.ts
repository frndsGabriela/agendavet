export class CalculadoraDeTaxaCancelamento {
  calcular(
    valor: number,
    inicio: Date,
    momentoCancelamento: Date,
    planoPetMais: boolean
  ): number {
    const diferencaMs = inicio.getTime() - momentoCancelamento.getTime();
    const antecedenciaHoras = diferencaMs / (1000 * 60 * 60);

    if (antecedenciaHoras >= 24) {
      return 0;
    }

    return 0;
  }
}