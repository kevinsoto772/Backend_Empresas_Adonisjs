/* eslint-disable max-len */
import { GenerarContrasena} from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { EncriptadorAdonis } from 'App/Infraestructura/Encriptacion/EncriptadorAdonis'
import { RepositorioRolDB } from 'App/Infraestructura/Implementacion/BaseDatos/RepositorioRolDB'
import { RepositorioUsuarioEmpresaDB } from 'App/Infraestructura/Implementacion/BaseDatos/RepositorioUsuarioEmpresaDB'
import { ServicioRol } from './ServicioRol'
import { ServicioUsuarioEmpresa } from './ServicioUsuarioEmpresa'
import { ServicioUsuarioNovafianza } from './ServicioUsuarioNovafianza'
import { ServicioAutenticacionJWT } from 'App/Dominio/Datos/Servicios/ServicioJWT'
import { Exception } from '@adonisjs/core/build/standalone'
import { RespuestaInicioSesion } from 'App/Dominio/Dto/RespuestaInicioSesion'
import { UsuarioEmpresa } from '../Entidades/UsuarioEmpresa'
import { UsuarioNovafianza } from '../Entidades/UsuarioNovafianza'

export class ServicioAutenticacion{
  constructor (private servicioUsuarioEmpresa:ServicioUsuarioEmpresa,
    private servicioUsuarioNovafianza:ServicioUsuarioNovafianza, private Rolservice: ServicioRol, private encriptador: EncriptadorAdonis
  ) {
    this.Rolservice = new ServicioRol(new RepositorioRolDB())
    this.servicioUsuarioEmpresa = new ServicioUsuarioEmpresa(new RepositorioUsuarioEmpresaDB(), new GenerarContrasena(), new EncriptadorAdonis())
  }

  public async iniciarSesion (usuario: string, contrasena: string): Promise<RespuestaInicioSesion>{
    const usuarioVerificado = await this.verificarUsuario(usuario)
    if (!usuarioVerificado) {
      throw new Exception('Credenciales incorrectas', 400)
    }

    if (!await this.encriptador.comparar(contrasena, usuarioVerificado.clave)) {
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
}
