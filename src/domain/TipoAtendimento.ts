export enum TipoAtendimento {
  CONSULTA = 'CONSULTA',
  VACINA = 'VACINA',
  CIRURGIA = 'CIRURGIA',
  BANHO_TOSA = 'BANHO_TOSA'
}

export type StatusConsulta = 'AGENDADA' | 'CANCELADA';

export interface NovaConsulta {
  tutor: string;
  telefone: string; 
  pet: string;
  tipo: TipoAtendimento;
  dataHora: Date;
  planoPetMais: boolean;
}

export interface Consulta extends NovaConsulta {
  id: number;
  valor: number;
  status: StatusConsulta;
}