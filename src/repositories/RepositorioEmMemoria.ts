import { Consulta } from '../domain/TipoAtendimento';
import { IRepositorioConsultas } from './IRepositorioConsultas';

export class RepositorioEmMemoria implements IRepositorioConsultas {
  private consultas = new Map<number, Consulta>();
  private proximoId = 1;

  salvar(dadosConsulta: Omit<Consulta, 'id'>): Consulta {
    const id = this.proximoId++;
    const consulta: Consulta = { ...dadosConsulta, id };
    this.consultas.set(id, consulta);
    return consulta;
  }

  buscarPorId(id: number): Consulta | undefined {
    return this.consultas.get(id);
  }

  atualizar(consulta: Consulta): void {
    if (!this.consultas.has(consulta.id)) {
      throw new Error(`Consulta com ID ${consulta.id} não encontrada para atualização.`);
    }
    this.consultas.set(consulta.id, consulta);
  }

  listar(): Consulta[] {
    return Array.from(this.consultas.values());
  }
}