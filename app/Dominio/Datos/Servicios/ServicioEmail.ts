import { Exception } from '@adonisjs/core/build/standalone'
import { EnviadorEmail } from 'App/Dominio/Email/EnviadorEmail'
import { GeneradorContrasena } from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { UsuarioEmpresa } from '../Entidades/UsuarioEmpresa'
import { UsuarioNovafianza } from '../Entidades/UsuarioNovafianza'
import { ServicioUsuarioEmpresa } from './ServicioUsuarioEmpresa'
import { ServicioUsuarioNovafianza } from './ServicioUsuarioNovafianza'
import { RepositorioBloqueoUsuario } from 'App/Dominio/Repositorios/RepositorioBloqueoUsuario'
import Env from '@ioc:Adonis/Core/Env'
import { EmailRecuperacionContrasena } from 'App/Dominio/Email/Emails/EmailRecuperacionContrasena'

export class ServicioEmail{
  constructor (
    private enviadorEmail: EnviadorEmail, 
    private servicioUsuarioEmpresa: ServicioUsuarioEmpresa,
    private generarContrasena: GeneradorContrasena, 
    private servicioUsuarioNovafianza: ServicioUsuarioNovafianza,
    private repositorioRegistroBloqueo: RepositorioBloqueoUsuario
    ) { }

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
    if (usuarioVerificado instanceof UsuarioEmpresa) {
      await this.servicioUsuarioEmpresa.actualizarUsuarioEmpresa(usuarioVerificado.id, usuarioVerificado )
      const registroBloqueo = await this.repositorioRegistroBloqueo.obtenerRegistroPorUsuario(usuarioVerificado.identificacion)
      if(registroBloqueo && registroBloqueo.elUsuarioEstaBloqueado()){
        registroBloqueo.desbloquearUsuario()
        await this.repositorioRegistroBloqueo.actualizarRegistro(registroBloqueo)
      } 
    }

    if (usuarioVerificado instanceof UsuarioNovafianza) {
      await this.servicioUsuarioNovafianza.actualizarUsuarioNovafianza(usuarioVerificado.id, usuarioVerificado)
      const registroBloqueo = await this.repositorioRegistroBloqueo.obtenerRegistroPorUsuario(usuarioVerificado.identificacion)
      if(registroBloqueo && registroBloqueo.elUsuarioEstaBloqueado()){
        registroBloqueo.desbloquearUsuario()
        await this.repositorioRegistroBloqueo.actualizarRegistro(registroBloqueo)
      } 
    }

    await this.enviadorEmail.enviarTemplate({
      asunto: 'Recuperación de contraseña Novafianza S.A.S',
      destinatarios: usuarioVerificado.correo,
      de: Env.get('SMTP_USERNAME')
    }, new EmailRecuperacionContrasena({
      nombre: usuarioVerificado.nombre,
      clave: clave,
      usuario: usuarioVerificado.identificacion
    }))
  }

  public async verificarUsuario (usuario: string): Promise<UsuarioEmpresa | UsuarioNovafianza> {
    const usuarioEmpresa = await this.servicioUsuarioEmpresa.obtenerUsuarioEmpresaPorUsuario(usuario)

    if (!usuarioEmpresa) {
      const usuarioNovafianza = await this.servicioUsuarioNovafianza.obtenerUsuarioNovafianzaPorUsuario(usuario)
      if(!usuarioNovafianza){
        throw new Exception('No se encuentra usuario registrado', 400)
      }
      return usuarioNovafianza
    }
    return usuarioEmpresa
  }
}
