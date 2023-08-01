/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioArchivoEmpresa } from 'App/Dominio/Datos/Servicios/ServicioArchivoEmpresa'
import { RepositorioArchivoEmpresaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioArchivoEmpresaDB'
import { validadorArchivosEmpresa } from './Validadores/ValidadorArchivosEmpresa'
import { extname } from 'path';
import Drive from '@ioc:Adonis/Core/Drive';
import { validadorVincularManual } from './Validadores/ValidadorVincularManual';
import { MapeadorFicheroAdonis } from '../Mapeadores/MapeadorFicheroAdonis';
import { RepositorioFicheroLocal } from 'App/Infraestructura/Ficheros/RepositorioFicheroLocal';

export default class ControladorArchivoEmpresa {
  private service: ServicioArchivoEmpresa
  constructor() {
    this.service = new ServicioArchivoEmpresa(new RepositorioArchivoEmpresaDB(), new RepositorioFicheroLocal)
  }

  public async listarPorEmpresa({ request, response }: HttpContextContract) {
    const idEmpresa = request.param('idEmpresa')
    const archivosEmpresa = await this.service.obtenerArchivosPorEmpresa(idEmpresa)
    response.status(200).send(archivosEmpresa)
  }

  public async listar({ params }) {
    const archivosEmpresas = await this.service.obtenerArchivosEmpresas(params)
    return archivosEmpresas
  }

  public async obtenerArchivoEmpresaPorId({ params }: HttpContextContract) {
    const archivoEmpresa = await this.service.obtenerArchivoEmpresaPorId(params.id)
    return archivoEmpresa
  }

  public async actualizarArchivoEmpresa({ params, request, response }: HttpContextContract) {
    const manual = request.file('manual', {
      extnames: ['pdf'],
    })

    if (manual && !manual.isValid) {
      return response.status(400).send({ mensaje: 'Formato incorrecto para el archivo' })
    }
    const dataArchivoEmpresa = request.all() as any
    const archivoEmpresa = await this.service.actualizarArchivoEmpresa(params.id, dataArchivoEmpresa)
    return archivoEmpresa
  }

  public async guardarArchivoEmpresa({ request, response }) {
    const manual = request.file('manual', {
      extnames: ['pdf'],
    })

    if (manual && !manual.isValid) {
      return response.status(400).send({ mensaje: 'Formato incorrecto para el archivo' })
    }
    const dataArchivoEmpresa = request.all()
    const archivoEmpresa = await this.service.guardarArchivoEmpresa(dataArchivoEmpresa)
    return archivoEmpresa
  }

  public async vincularManual({request, response}: HttpContextContract){
    const { manual, idArchivo, idEmpresa } = await request.validate({ schema: validadorVincularManual })
    const ficheroManual = await MapeadorFicheroAdonis.obtenerFichero(manual)
    await this.service.guardarManual(ficheroManual, idEmpresa, idArchivo)
    response.status(200).send({
      mensaje: "Manual asociado correctamente.",
      estado: 200
    })
  }

  public async guardarMultiplesArchivosEmpresa({ request, response }: HttpContextContract) {
    const { idArchivos, idEmpresa } = await request.validate({ schema: validadorArchivosEmpresa })
    await this.service.guardarArchivosEmpresa(idArchivos, idEmpresa)
    response.status(204).send(undefined)
  }

  public async cambiarEstado({ request, response }: HttpContextContract) {
    try {
      let id = request.param('id')
      await this.service.cambiarEstado(id)
      response.status(200).send('Cambio realizado correctamente')
    } catch (e) {
      response.status(404).send(e)
    }
  }

  public async obtenerVariables({ request, response }: HttpContextContract) {
    const { idEmpresa, idArchivo } = request.all()
    const {estructura , estado } = await this.service.obtenerVariables(idEmpresa, idArchivo)  

   if(estado == 200) return response.status(200).send(estructura)

   if(estado == 503) return response.status(503).send(estructura)

   if(estado == 404) return response.status(404).send('No se encontro una estructura asociada a este archivo')
  
  }

  public async manual({ request, response }: HttpContextContract) {
    const nombreArchivo = request.param('*').join('/')
    const ubicacion = `/manuales/${nombreArchivo}`
    try {
      const { size } = await Drive.getStats(ubicacion)
      response.type(extname(ubicacion))
      response.header('content-length', size)

      return response.stream(await Drive.getStream(ubicacion))
    } catch (error) {
      response.status(400).send("Archivo no encontrado")
    }

  }
}
