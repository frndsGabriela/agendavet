import { ZapLegacySDK } from '../libs/zap-legacy-sdk';
import { INotificador } from './INotificador';

export class ZapAdapter implements INotificador {
  constructor(private readonly zapLegacy: ZapLegacySDK) {}

  enviar(telefone: string, mensagem: string): void {
    const numeroComDDI = '55' + telefone;
    const resposta = this.zapLegacy.dispararMsg(numeroComDDI, { txt: mensagem });
    
    if (!resposta.ok) {
      throw new Error('Falha ao notificar');
    }
  }
}