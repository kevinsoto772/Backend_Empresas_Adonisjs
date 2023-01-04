/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioAutenticacion } from 'App/Dominio/Datos/Servicios/ServicioAutenticacion'
import { ServicioAutenticacionJWT } from 'App/Dominio/Datos/Servicios/ServicioJWT'
import { ServicioRol } from 'App/Dominio/Datos/Servicios/ServicioRol'
import { ServicioUsuarioEmpresa } from 'App/Dominio/Datos/Servicios/ServicioUsuarioEmpresa'
import { ServicioUsuarioNovafianza } from 'App/Dominio/Datos/Servicios/ServicioUsuarioNovafianza'
import { GenerarContrasena } from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { EncriptadorAdonis } from 'App/Infraestructura/Encriptacion/EncriptadorAdonis'
import { RepositorioRolDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioRolDB'
import { RepositorioUsuarioEmpresaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioUsuarioEmpresaDB'
import { RepositorioUsuarioNovafianzaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioUsuarioNovafianzaDB'
export default class ControladorArchivoVariable {
  private service: ServicioAutenticacion
  constructor () {
    this.service = new ServicioAutenticacion(new ServicioUsuarioEmpresa(new RepositorioUsuarioEmpresaDB(), new GenerarContrasena(), new EncriptadorAdonis()),
      new ServicioUsuarioNovafianza(new RepositorioUsuarioNovafianzaDB(), new GenerarContrasena()),
      new ServicioRol(new RepositorioRolDB()), new EncriptadorAdonis()
    )
  }

  public async inicioSesionEmpresa ({ request }) {
    const peticion = request.all()
    const usuario = peticion['usuario']
    const contrasena = peticion['contrasena']
    const datos = await this.service.iniciarSesion(usuario, contrasena)
    return datos
  }

  public async inicioSesionNovafianza ({ request, response }:HttpContextContract) {
    const peticion = request.all()
    const usuario = peticion['usuario']
    const contrasena = peticion['contrasena']
    response.status(200).send({
      token: ServicioAutenticacionJWT.generarToken(usuario, contrasena),
    })
  }
}
