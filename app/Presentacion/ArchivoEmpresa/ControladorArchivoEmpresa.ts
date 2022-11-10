/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioArchivoEmpresa } from 'App/Dominio/Datos/Servicios/ServicioArchivoEmpresa'
import { RepositorioArchivoEmpresaDB } from 'App/Infraestructura/Implementacion/BaseDatos/RepositorioArchivoEmpresaDB'

export default class ControladorArchivoEmpresa {
  private service: ServicioArchivoEmpresa
  constructor () {
    this.service = new ServicioArchivoEmpresa(new RepositorioArchivoEmpresaDB())
  }

  public async listar ({ params }) {
    const archivosEmpresas = await this.service.obtenerArchivosEmpresas(params)
    return archivosEmpresas
  }

  public async obtenerArchivoEmpresaPorId ({ params }) {
    const archivoEmpresa = await this.service.obtenerArchivoEmpresaPorId(params.id)
    return archivoEmpresa
  }

  public async actualizarArchivoEmpresa ({ params, request }) {
    const dataArchivoEmpresa = request.all()
    const archivoEmpresa= await this.service.actualizarArchivoEmpresa(params.id, dataArchivoEmpresa)
    return archivoEmpresa
  }

  public async guardarArchivoEmpresa ({ request }) {
    const dataArchivoEmpresa = request.all()
    const archivoEmpresa = await this.service.guardarArchivoEmpresa(dataArchivoEmpresa)
    return archivoEmpresa
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
