import { TipoAtendimento } from '../domain/TipoAtendimento';

export interface RegraDePreco {
  readonly tipo: TipoAtendimento;
  calcular(): number; 
}

export class CalculadoraDePreco {
  constructor(private readonly regras: RegraDePreco[]) {}

  calcular(tipo: TipoAtendimento): number {
    const regra = this.regras.find(r => r.tipo === tipo);
    if (!regra) {
      throw new Error(`Tipo de atendimento não suportado: ${tipo}`);
    }
    return regra.calcular();
  }
}