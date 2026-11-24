import { TipoAtendimento } from '../domain/TipoAtendimento';
import { RegraDePreco } from './RegraDePreco';

export class PrecoConsulta implements RegraDePreco {
  readonly tipo = TipoAtendimento.CONSULTA;
  calcular(): number {
    return 120;
  }
}

export class PrecoVacina implements RegraDePreco {
  readonly tipo = TipoAtendimento.VACINA;
  calcular(): number {
    return 80;
  }
}

export class PrecoCirurgia implements RegraDePreco {
  readonly tipo = TipoAtendimento.CIRURGIA;
  calcular(): number {
    return 540;
  }
}

export class PrecoBanhoTosa implements RegraDePreco {
  readonly tipo = TipoAtendimento.BANHO_TOSA;
  calcular(): number {
    return 65;
  }
}