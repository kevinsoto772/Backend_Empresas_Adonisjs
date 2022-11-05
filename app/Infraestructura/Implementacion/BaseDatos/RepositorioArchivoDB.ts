/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo'
import { Paginador } from 'App/Dominio/Paginador'
import { RepositorioArchivo } from 'App/Dominio/Repositorios/RepositorioArchivo'
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo'
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB'

export class RepositorioArchivoDB implements RepositorioArchivo {
  async obtenerArchivos (params: any): Promise<{archivos: Archivo[], paginacion: Paginador}> {
    const archivos: Archivo[] = []
    const archivosDB = await Tblarchivos.query().orderBy('id', 'desc').paginate(params.pagina, params.limite)
    archivosDB.forEach(archivosDB => {
      archivos.push(archivosDB.obtenerArchivo())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(archivosDB)
    return {archivos , paginacion}
  }

  async obtenerArchivoPorId (id: string): Promise<Archivo> {
    const archivo = await Tblarchivos.findOrFail(id)
    return archivo.obtenerArchivo()
  }

  async guardarArchivo (archivo: Archivo): Promise<void> {
    let archivoDb = new Tblarchivos()
    archivoDb.establecerArchivoDb(archivo)
    await archivoDb.save()
  }

  async actualizarArchivo (id: string, archivo: Archivo): Promise<string> {
    let archivoRetorno = await Tblarchivos.findOrFail(id)
    archivoRetorno.establecerArchivoConId(archivo)
    await archivoRetorno.save()
    return id
  }
}
