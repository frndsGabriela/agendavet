import { TipoAtendimento, NovaConsulta } from './domain/TipoAtendimento';
import { CalculadoraDePreco } from './pricing/RegraDePreco';
import { PrecoConsulta, PrecoVacina, PrecoCirurgia, PrecoBanhoTosa } from './pricing/regras';
import { RepositorioEmMemoria } from './repositories/RepositorioEmMemoria';
import { ZapLegacySDK } from './libs/zap-legacy-sdk';
import { ZapAdapter } from './notifications/ZapAdapter';
import { ClinicaFacade } from './facade/ClinicaFacade';

// 1. Montagem das dependências (Composição)
const repositorio = new RepositorioEmMemoria();

// Registrando as regras de preço no construtor da calculadora (incluindo BANHO_TOSA para o OCP)
const calculadora = new CalculadoraDePreco([
  new PrecoConsulta(),
  new PrecoVacina(),
  new PrecoCirurgia(),
  new PrecoBanhoTosa()
]);

const sdkZap = new ZapLegacySDK();
const notificador = new ZapAdapter(sdkZap);

// 2. Criando a Facade (porta de entrada única)
const clinicaFacade = new ClinicaFacade(repositorio, calculadora, notificador);

console.log('--- INICIANDO DEMONSTRAÇÃO DA AGENDA VET ---');

try {
  // Consulta 1: Normal (Consulta)
  const c1 = clinicaFacade.agendar({
    tutor: 'Ana',
    telefone: '31999991111',
    pet: 'Thor',
    tipo: TipoAtendimento.CONSULTA,
    dataHora: new Date('2027-01-10T14:00:00'),
    planoPetMais: false
  });
  console.log('Agendado com sucesso:', c1);

  // Consulta 2: Com Plano Pet+ (Vacina com 20% de desconto)
  const c2 = clinicaFacade.agendar({
    tutor: 'Carlos',
    telefone: '31988882222',
    pet: 'Mel',
    tipo: TipoAtendimento.VACINA,
    dataHora: new Date('2027-01-11T10:30:00'),
    planoPetMais: true
  });
  console.log('Agendado com sucesso:', c2);

  // Consulta 3: Nova regra adicionada sem alterar a calculadora (Banho e Tosa)
  const c3 = clinicaFacade.agendar({
    tutor: 'Mariana',
    telefone: '31977773333',
    pet: 'Bob',
    tipo: TipoAtendimento.BANHO_TOSA,
    dataHora: new Date('2027-01-12T16:00:00'),
    planoPetMais: false
  });
  console.log('Agendado com sucesso:', c3);

  console.log('\n--- LISTA DE TODAS AS CONSULTAS NO SISTEMA ---');
  console.table(clinicaFacade.listar());

} catch (error: any) {
  console.error('Erro durante a execução:', error.message);
}