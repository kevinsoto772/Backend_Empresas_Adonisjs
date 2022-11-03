/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioEmpresa } from 'App/Dominio/Datos/Servicios/ServicioEmpresa'
import { RepositorioEmpresaDB } from 'App/Infraestructura/Implementacion/BaseDatos/RepositorioEmpresaDB'
export default class EmpresasController {
  private service: ServicioEmpresa
  constructor () {
    this.service = new ServicioEmpresa(new RepositorioEmpresaDB())
  }

  public async listar ({ params }) {
    const empresa = await this.service.obtenerEmpresas(params)
    return empresa
  }

  public async obtenerEmpresaPorId ({ params }) {
    const empresa = await this.service.obtenerEmpresaPorId(params.id)
    return empresa
  }

  public async actualizarEmpresa ({ params, request }) {
    const dataEmpresa = request.all()
    const empresa = await this.service.actualizarEmpresa(params.id, dataEmpresa)
    return empresa
  }

  public async guardarEmpresa ({ request }) {
    const dataEmpresa = request.all()
    const empresa = await this.service.guardarEmpresa(dataEmpresa)
    return empresa
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
