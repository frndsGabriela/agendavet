import { Consulta, NovaConsulta, StatusConsulta } from '../domain/TipoAtendimento';
import { CalculadoraDePreco } from '../pricing/RegraDePreco';
import { DescontoPlanoPet } from '../pricing/DescontoPlanoPet';
import { CalculadoraDeTaxaCancelamento } from '../pricing/CalculadoraDeTaxaCancelamento';
import { IRepositorioConsultas } from '../repositories/IRepositorioConsultas';
import { INotificador } from '../notifications/INotificador';

export class ClinicaFacade {
  constructor(
    private readonly repositorio: IRepositorioConsultas,
    private readonly calculadora: CalculadoraDePreco,
    private readonly notificador: INotificador,
    private readonly calculadoraTaxaCancelamento: CalculadoraDeTaxaCancelamento = new CalculadoraDeTaxaCancelamento()
  ) {}

  agendar(dados: NovaConsulta): Consulta {
    if (!dados.tutor || !dados.telefone || !dados.pet || !dados.tipo || !dados.dataHora) {
      throw new Error('Preencha todos os campos obrigatórios para o agendamento.');
    }

    // Calcula o preço base
    let precoBase = this.calculadora.calcular(dados.tipo);

    // Aplica o Decorator do Plano Pet+ se necessário
    if (dados.planoPetMais) {
      const regraBase = {
        tipo: dados.tipo,
        calcular: () => precoBase
      };
      const regraComDesconto = new DescontoPlanoPet(regraBase);
      precoBase = regraComDesconto.calcular();
    }

    const novaConsultaData = {
      ...dados,
      valor: precoBase,
      status: 'AGENDADA' as StatusConsulta
    };

    const consultaSalva = this.repositorio.salvar(novaConsultaData);

    // Formata a data para a mensagem
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dados.dataHora));

    const valorFormatado = consultaSalva.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const mensagem = `Olá ${dados.tutor}! A consulta do ${dados.pet} foi agendada para ${dataFormatada}. Valor: ${valorFormatado}`;

    this.notificador.enviar(dados.telefone, mensagem);

    return consultaSalva;
  }

  cancelar(id: number, momentoCancelamento: Date = new Date()): Consulta {
    const consulta = this.repositorio.buscarPorId(id);
    if (!consulta) {
      throw new Error(`Consulta com ID ${id} não existe.`);
    }
    if (consulta.status === 'CANCELADA') {
      throw new Error(`A consulta com ID ${id} já está cancelada.`);
    }

    const taxa = this.calculadoraTaxaCancelamento.calcular(
      consulta.valor,
      new Date(consulta.dataHora),
      new Date(momentoCancelamento),
      consulta.planoPetMais
    );

    consulta.status = 'CANCELADA';
    consulta.taxaCancelamento = taxa;
    this.repositorio.atualizar(consulta);
    return consulta;
  }

  listar(): Consulta[] {
    return this.repositorio.listar();
  }
}