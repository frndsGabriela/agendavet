import { Consulta } from '../domain/TipoAtendimento';

export interface IRepositorioConsultas {
  salvar(consulta: Omit<Consulta, 'id'>): Consulta; 
  buscarPorId(id: number): Consulta | undefined;
  atualizar(consulta: Consulta): void;
  listar(): Consulta[];
}