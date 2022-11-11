/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioAutenticacionJWT } from 'App/Dominio/Datos/Servicios/ServicioJWT'

export default class ControladorArchivoVariable {
  constructor () {}

  public async inicioSesionEmpresa ({ request, response }:HttpContextContract) {
    const peticion = request.all()
    const usuario = peticion['usuario']
    const contrasena = peticion['contrasena']
    response.status(200).send({
        token: ServicioAutenticacionJWT.generarToken(usuario, contrasena)
    })
  }

  public async inicioSesionNovafianza ({ request, response }:HttpContextContract) {
    const peticion = request.all()
    const usuario = peticion['usuario']
    const contrasena = peticion['contrasena']
    response.status(200).send({
        token: ServicioAutenticacionJWT.generarToken(usuario, contrasena)
    })
  }
}
