/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { Exception } from '@adonisjs/core/build/standalone'
import { EnviadorEmail } from 'App/Dominio/Email/EnviadorEmail'
import { GenerarContrasena } from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { UsuarioEmpresa } from '../Entidades/UsuarioEmpresa'
import { UsuarioNovafianza } from '../Entidades/UsuarioNovafianza'
import { ServicioUsuarioEmpresa } from './ServicioUsuarioEmpresa'
import { ServicioUsuarioNovafianza } from './ServicioUsuarioNovafianza'

export class ServicioEmail{
  constructor (private enviadorEmail: EnviadorEmail, private servicioUsuarioEmpresa: ServicioUsuarioEmpresa,
    private generarContrasena: GenerarContrasena, private servicioUsuarioNovafianza: ServicioUsuarioNovafianza) { }

  public async ComprobarUsuario (usuario: string, correo: string) {
    const usuarioVerificado = await this.verificarUsuario(usuario)
    if (!usuarioVerificado) {
      throw new Exception('No se encuentra usuario registrado', 400)
    }
    if (usuarioVerificado.correo !== correo) {
      console.log(usuarioVerificado.correo, 'ingresado = ', correo)
      throw new Exception('El email ingresado no coincide con el del usuario', 400)
    }
    const clave = await this.generarContrasena.generar()
    usuarioVerificado.clave = clave,
    usuarioVerificado.claveTemporal = true
    if (usuarioVerificado as UsuarioEmpresa) {
      const actualizacionDatos = await this.servicioUsuarioEmpresa.actualizarUsuarioEmpresa(usuarioVerificado.id, (usuarioVerificado as UsuarioEmpresa))
    }

    if (usuarioVerificado as UsuarioNovafianza) {
      const actualizacionDatos = await this.servicioUsuarioNovafianza.actualizarUsuarioNovafianza(usuarioVerificado.id,(usuarioVerificado as UsuarioNovafianza))
    }

    this.enviarEmail('Recuperar contraseña novafianza (No responder)', `Hola ${usuarioVerificado.nombre} ${usuarioVerificado.apellido} recibimos su solicitud
    su nueva contraseña es: ${clave}`, [correo]
    )
  }

  enviarEmail (asunto:string, texto:string, destinatarios:string[], etiquetas?:string[]): void{
    return this.enviadorEmail.enviarEmail(asunto, texto, destinatarios, etiquetas)
  }

  public async verificarUsuario (usuario: string): Promise<UsuarioEmpresa | UsuarioNovafianza> {
    const usuarioEmpresa = await this.servicioUsuarioEmpresa.obtenerUsuarioEmpresaPorUsuario(usuario)

    if (!usuarioEmpresa) {
      const usuarioNovafianza = await this.servicioUsuarioNovafianza.obtenerUsuarioNovafianzaPorUsuario(usuario)
      return usuarioNovafianza
    }
    return usuarioEmpresa
  }
}
