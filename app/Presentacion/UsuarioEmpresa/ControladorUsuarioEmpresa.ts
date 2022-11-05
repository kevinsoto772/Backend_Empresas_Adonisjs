/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioUsuarioEmpresa } from 'App/Dominio/Datos/Servicios/ServicioUsuarioEmpresa'
import { RepositorioUsuarioEmpresaDB } from '../../Infraestructura/Implementacion/BaseDatos/RepositorioUsuarioEmpresaDB'

export default class ControladorUsuarioEmpresa {
  private service: ServicioUsuarioEmpresa
  constructor () {
    this.service = new ServicioUsuarioEmpresa(new RepositorioUsuarioEmpresaDB())
  }

  public async listar ({ params }) {
    const usuariosEmpresa = await this.service.obtenerUsuariosEmpresa(params)
    return usuariosEmpresa
  }

  public async obtenerUsuarioEmpresaPorId ({ params }) {
    const usuarioEmpresa = await this.service.obtenerUsuarioEmpresaPorId(params.id)
    return usuarioEmpresa
  }

  public async actualizarUsuarioEmpresa ({ params, request }) {
    const dataUsuarioEmpresa = request.all()
    const usuarioEmpresa = await this.service.actualizarUsuarioEmpresa(params.id, dataUsuarioEmpresa)
    return usuarioEmpresa
  }

  public async guardarUsuarioEmpresa ({ request }) {
    const dataUsuarioEmpresa = request.all()
    const usuarioEmpresa = await this.service.guardarUsuarioEmpresa(dataUsuarioEmpresa)
    return usuarioEmpresa
  }

  public async cambiarEstado ({request, response}:HttpContextContract){
    try{
      let id = request.param('id')
      await this.service.cambiarEstado(id)
      response.status(200).send('Cambio realizado correctamente')
    } catch (e) {
      response.status(200).send(e)
    }
  }
}
