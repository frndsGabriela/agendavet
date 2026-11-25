import { ClinicaFacade } from './ClinicaFacade';
import { TipoAtendimento } from '../domain/TipoAtendimento';
import { CalculadoraDePreco, RegraDePreco } from '../pricing/RegraDePreco';
import { CalculadoraDeTaxaCancelamento } from '../pricing/CalculadoraDeTaxaCancelamento';
import { RepositorioEmMemoria } from '../repositories/RepositorioEmMemoria';
import { INotificador } from '../notifications/INotificador';

describe('ClinicaFacade (integração)', () => {
  const regras: RegraDePreco[] = [
    { tipo: TipoAtendimento.CONSULTA, calcular: () => 120 },
    { tipo: TipoAtendimento.VACINA, calcular: () => 80 },
    { tipo: TipoAtendimento.CIRURGIA, calcular: () => 540 },
    { tipo: TipoAtendimento.BANHO_TOSA, calcular: () => 70 }
  ];

  const criarAmbiente = () => {
    const repositorio = new RepositorioEmMemoria();
    const calculadoraPreco = new CalculadoraDePreco(regras);
    const mensagensEnviadas: Array<{ telefone: string; mensagem: string }> = [];
    const notificador: INotificador = {
      enviar: (telefone, mensagem) => {
        mensagensEnviadas.push({ telefone, mensagem });
      }
    };
    const calculadoraTaxa = new CalculadoraDeTaxaCancelamento();
    const facade = new ClinicaFacade(
      repositorio,
      calculadoraPreco,
      notificador,
      calculadoraTaxa
    );

    return { facade, repositorio, mensagensEnviadas };
  };

  it('agenda consulta aplicando desconto do Plano Pet+ e envia notificação', () => {
    const { facade, mensagensEnviadas } = criarAmbiente();
    const dataHora = new Date('2027-02-10T10:00:00');

    const consulta = facade.agendar({
      tutor: 'Ana',
      telefone: '31999999999',
      pet: 'Thor',
      tipo: TipoAtendimento.CONSULTA,
      dataHora,
      planoPetMais: true
    });

    expect(consulta.id).toBe(1);
    expect(consulta.valor).toBe(96);
    expect(consulta.status).toBe('AGENDADA');
    expect(mensagensEnviadas).toHaveLength(1);
    expect(mensagensEnviadas[0].telefone).toBe('31999999999');
    expect(mensagensEnviadas[0].mensagem).toContain('Ana');
    expect(mensagensEnviadas[0].mensagem).toContain('Thor');
  });

  it('cancela consulta com 30% de taxa e salva taxaCancelamento no repositório', () => {
    const { facade, repositorio } = criarAmbiente();
    const inicio = new Date('2027-02-10T10:00:00');

    const consulta = facade.agendar({
      tutor: 'Carlos',
      telefone: '31988888888',
      pet: 'Luna',
      tipo: TipoAtendimento.CONSULTA,
      dataHora: inicio,
      planoPetMais: false
    });

    const momentoCancelamento = new Date(inicio.getTime() - 5 * 60 * 60 * 1000);
    const cancelada = facade.cancelar(consulta.id, momentoCancelamento);

    expect(cancelada.status).toBe('CANCELADA');
    expect(cancelada.taxaCancelamento).toBe(36);
    expect(repositorio.buscarPorId(consulta.id)?.taxaCancelamento).toBe(36);
  });

  it('cancela consulta com 24h ou mais sem cobrar taxa', () => {
    const { facade } = criarAmbiente();
    const inicio = new Date('2027-02-10T10:00:00');

    const consulta = facade.agendar({
      tutor: 'Marina',
      telefone: '31977777777',
      pet: 'Pipoca',
      tipo: TipoAtendimento.VACINA,
      dataHora: inicio,
      planoPetMais: false
    });

    const momentoCancelamento = new Date(inicio.getTime() - 24 * 60 * 60 * 1000);
    const cancelada = facade.cancelar(consulta.id, momentoCancelamento);

    expect(cancelada.status).toBe('CANCELADA');
    expect(cancelada.taxaCancelamento).toBe(0);
  });

  it('lança erro ao tentar cancelar consulta inexistente ou já cancelada', () => {
    const { facade } = criarAmbiente();
    const inicio = new Date('2027-02-10T10:00:00');

    expect(() => facade.cancelar(999, inicio)).toThrow();

    const consulta = facade.agendar({
      tutor: 'Lucas',
      telefone: '31966666666',
      pet: 'Rex',
      tipo: TipoAtendimento.CONSULTA,
      dataHora: inicio,
      planoPetMais: false
    });

    facade.cancelar(consulta.id, inicio);
    expect(() => facade.cancelar(consulta.id, inicio)).toThrow();
  });
});