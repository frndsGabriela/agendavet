import { CalculadoraDeTaxaCancelamento } from './CalculadoraDeTaxaCancelamento';

describe('CalculadoraDeTaxaCancelamento', () => {
  const calc = new CalculadoraDeTaxaCancelamento();
  const inicio = new Date('2027-01-10T14:00:00');

  const antes = (horas: number, minutos = 0) =>
    new Date(inicio.getTime() - (horas * 60 + minutos) * 60_000);

  it('não cobra taxa com 24h ou mais de antecedência', () => {
    expect(calc.calcular(120, inicio, antes(24), false)).toBe(0);
  });

  it('cobra 30% com 23h59min de antecedência', () => {
    expect(calc.calcular(120, inicio, antes(23, 59), false)).toBe(36);
  });

  it('cobra 30% com 2h exatas de antecedência', () => {
    expect(calc.calcular(120, inicio, antes(2, 0), false)).toBe(36);
  });

  it('cobra 50% com 1h59min de antecedência', () => {
    expect(calc.calcular(200, inicio, antes(1, 59), false)).toBe(100);
  });

  it('cobra 50% com 30min de antecedência', () => {
    expect(calc.calcular(200, inicio, antes(0, 30), false)).toBe(100);
  });

  it('aplica 20% de desconto na taxa para Plano Pet+', () => {
    expect(calc.calcular(100, inicio, antes(1, 0), true)).toBe(40);
  });

  it('arredonda a taxa para 2 casas decimais', () => {
    expect(calc.calcular(99.99, inicio, antes(1, 0), true)).toBe(40);
  });
});