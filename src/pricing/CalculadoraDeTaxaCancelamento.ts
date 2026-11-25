export class CalculadoraDeTaxaCancelamento {
  calcular(
    valor: number,
    inicio: Date,
    momentoCancelamento: Date,
    planoPetMais: boolean
  ): number {
    const diferencaMs = inicio.getTime() - momentoCancelamento.getTime();
    const antecedenciaHoras = diferencaMs / (1000 * 60 * 60);

    let percentual = 0;

    if (antecedenciaHoras >= 24) {
      percentual = 0;
    } else if (antecedenciaHoras >= 2) {
      percentual = 0.3;
    } else {
      percentual = 0.5;
    }

    let taxa = valor * percentual;

    if (planoPetMais) {
      taxa *= 0.8;
    }

    return Math.round(taxa * 100) / 100;
  }
}