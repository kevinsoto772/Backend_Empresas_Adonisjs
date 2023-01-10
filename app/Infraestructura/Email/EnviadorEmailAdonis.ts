/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { EnviadorEmail } from 'App/Dominio/Email/EnviadorEmail'

export class EnviadorEmailAdonis implements EnviadorEmail {
  enviarEmail (asunto:string, texto: string, destinatarios: string[], etiquetas?: string[] | undefined): void {
    Mail.send(mensaje => {
      mensaje
        .subject(asunto)
        .from('jesing482@gmail.com', Env.get('EMAIL_ALIAS'))
        .cc(destinatarios.join(';'))
        .text(texto)
    })
  }
  enviarEmailConTemplate (asunto:string, texto: string, destinatarios: string[], etiquetas?: string[] | undefined): void {
    throw new Error('Method not implemented.')
  }
}
