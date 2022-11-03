/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioArchivo } from 'App/Dominio/Datos/Servicios/ServicioArchivo'
import { RepositorioArchivoDB } from '../../Infraestructura/Implementacion/BaseDatos/RepositorioArchivoDB'
export default class ArchivosController {
  private service: ServicioArchivo
  constructor () {
    this.service = new ServicioArchivo(new RepositorioArchivoDB())
  }

  public async listar ({ params }) {
    const empresa = await this.service.obtenerArchivos(params)
    return empresa
  }

  public async obtenerArchivoPorId ({ params }) {
    const empresa = await this.service.obtenerArchivoPorId(params.id)
    return empresa
  }

  public async actualizarArchivo ({ params, request }) {
    const dataEmpresa = request.all()
    const empresa = await this.service.actualizarArchivo(params.id, dataEmpresa)
    return empresa
  }

  public async guardarArchivo ({ request }) {
    const dataEmpresa = request.all()
    const empresa = await this.service.guardarArchivo(dataEmpresa)
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
