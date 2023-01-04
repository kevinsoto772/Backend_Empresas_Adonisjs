/* eslint-disable max-len */
import { GenerarContrasena} from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { EncriptadorAdonis } from 'App/Infraestructura/Encriptacion/EncriptadorAdonis'
import { RepositorioRolDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioRolDB'
import { RepositorioUsuarioEmpresaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioUsuarioEmpresaDB'
import { ServicioRol } from './ServicioRol'
import { ServicioUsuarioEmpresa } from './ServicioUsuarioEmpresa'
import { ServicioUsuarioNovafianza } from './ServicioUsuarioNovafianza'
import { ServicioAutenticacionJWT } from 'App/Dominio/Datos/Servicios/ServicioJWT'
import { Exception } from '@adonisjs/core/build/standalone'
import { RespuestaInicioSesion } from 'App/Dominio/Dto/RespuestaInicioSesion'
import { UsuarioEmpresa } from '../Entidades/UsuarioEmpresa'
import { UsuarioNovafianza } from '../Entidades/UsuarioNovafianza'
import { Encriptador } from 'App/Dominio/Encriptacion/Encriptador'
import { RepositorioBloqueoUsuario } from 'App/Dominio/Repositorios/RepositorioBloqueoUsuario'
import { RegistroBloqueo } from '../Entidades/Usuarios/RegistroBloqueo'
import { v4 as uuid } from 'uuid'

export class ServicioAutenticacion{
  constructor (
    private servicioUsuarioEmpresa:ServicioUsuarioEmpresa,
    private servicioUsuarioNovafianza:ServicioUsuarioNovafianza, 
    private Rolservice: ServicioRol, 
    private encriptador: Encriptador,
    private repositorioBloqueo: RepositorioBloqueoUsuario
  ) {
    this.Rolservice = new ServicioRol(new RepositorioRolDB())
    this.servicioUsuarioEmpresa = new ServicioUsuarioEmpresa(new RepositorioUsuarioEmpresaDB(), new GenerarContrasena(), new EncriptadorAdonis())
  }

  public async iniciarSesion (usuario: string, contrasena: string): Promise<RespuestaInicioSesion>{
    const usuarioVerificado = await this.verificarUsuario(usuario)
    let registroDeBloqueo = await this.repositorioBloqueo.obtenerRegistroPorUsuario(usuarioVerificado.identificacion)
    if(!registroDeBloqueo){
      registroDeBloqueo = await this.crearRegistroDeBloqueo(usuarioVerificado.identificacion)
    }
    if(registroDeBloqueo.elUsuarioEstaBloqueado()){
      throw new Exception('El usuario se encuentra bloqueado por exceder el número de intentos de inicio de sesión', 423)
    }
    if (!usuarioVerificado) {
      this.manejarIntentoFallido(registroDeBloqueo)
      throw new Exception('Credenciales incorrectas', 400)
    }

    if (!await this.encriptador.comparar(contrasena, usuarioVerificado.clave)) {
      this.manejarIntentoFallido(registroDeBloqueo)
      throw new Exception('Credenciales incorrectas', 400)
    }

    const rolUsuario = await this.Rolservice.obtenerRolporID(usuarioVerificado.idRol)
    const nombre = `${usuarioVerificado.nombre} ${usuarioVerificado.apellido}`
    const token = ServicioAutenticacionJWT.generarToken(usuario, contrasena)

    return new RespuestaInicioSesion(
      usuarioVerificado.id,
      usuario,
      token,
      rolUsuario,
      nombre,
      usuarioVerificado.claveTemporal)
  }

  public async verificarUsuario (usuario: string): Promise<UsuarioEmpresa | UsuarioNovafianza> {
    const usuarioEmpresa = await this.servicioUsuarioEmpresa.obtenerUsuarioEmpresaPorUsuario(usuario)
    if (!usuarioEmpresa) {
      const usuarioNovafianza = await this.servicioUsuarioNovafianza.obtenerUsuarioNovafianzaPorUsuario(usuario)
      return usuarioNovafianza
    }
    return usuarioEmpresa
  }

  private async crearRegistroDeBloqueo(identificacion:string):Promise<RegistroBloqueo>{
    const registro = new RegistroBloqueo(uuid(), identificacion, 0, false)
    return await this.repositorioBloqueo.crearRegistro(registro)
  }

  private async manejarIntentoFallido(registro:RegistroBloqueo):Promise<RegistroBloqueo>{
    registro.agregarIntentoFallido()
    return await this.repositorioBloqueo.actualizarRegistro(registro)
  }
}
