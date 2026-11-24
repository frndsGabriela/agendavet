import { RegraDePreco } from './RegraDePreco';

export class DescontoPlanoPet implements RegraDePreco {
  constructor(private readonly regraOriginal: RegraDePreco) {}

  get tipo() {
    return this.regraOriginal.tipo;
  }

  calcular(): number {
    return Math.round(this.regraOriginal.calcular() * 0.8 * 100) / 100;
  }
}