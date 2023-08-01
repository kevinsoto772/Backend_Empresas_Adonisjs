/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo'
import { Paginador } from 'App/Dominio/Paginador'
import { RepositorioArchivo } from 'App/Dominio/Repositorios/RepositorioArchivo'
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo'
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB'

export class RepositorioArchivoDB implements RepositorioArchivo {
  async obtenerArchivos (params: any): Promise<{archivos: Archivo[], paginacion: Paginador}> {
    const archivos: Archivo[] = []
    const archivosDB = await Tblarchivos.query().where('arc_estado',true).orderBy('id', 'desc').paginate(params.pagina, params.limite)
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

  async guardarArchivo (archivo: Archivo): Promise<Archivo> {
    console.log(archivo);
    
    let archivoDb = new Tblarchivos()
    archivoDb.establecerArchivoDb(archivo)
    await archivoDb.save()
    return archivoDb
  }

  async actualizarArchivo (id: string, archivo: Archivo): Promise<Archivo> {
    let archivoRetorno = await Tblarchivos.findOrFail(id)
    archivoRetorno.establecerArchivoConId(archivo)
    await archivoRetorno.save()
    return archivoRetorno
  }

  async buscar (params: string): Promise<{archivos: Archivo[], paginacion: Paginador}> {
    const { frase, pagina, limite } = JSON.parse(params);
    const archivos: Archivo[] = []
    const archivosDB = await Tblarchivos.query().whereILike('arc_nombre', `%${ frase }%`)
                                                .orWhereILike('arc_descripcion', `%${ frase }%`)
                                                .orderBy('arc_id', 'desc').paginate(pagina, limite)

  
    archivosDB.forEach(archivosDB => {
      archivos.push(archivosDB.obtenerArchivo())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(archivosDB)
    return {archivos , paginacion}
  }

  async obtenerArchivosPorEmpresa(idEmpresa: string): Promise<any> {
    /* const archivosEmpresaDb = await TblArchivoEmpresa.query().preload('archivo').where({ 'idEmpresa': idEmpresa })
    console.log(archivosEmpresaDb[0].archivo);
    
    return archivosEmpresaDb.map(archivoEmpresaDb => {
      return archivoEmpresaDb.obtenerArchivoEmpresa()
    }) */
    const archivos: Archivo[] = [];
    const archivosEmpresaDb = await Tblarchivos.query().preload('ArchivosEmpresa').whereHas('ArchivosEmpresa', sql =>{
      sql.where('emp_id', idEmpresa)
    }).orderBy('id', 'desc').paginate(1, 100)

     archivosEmpresaDb.map(archivo =>{
      archivos.push({
        "id": archivo.id ,
            "nombre": archivo.nombre ,
            "tipo": archivo.tipo ,
            "prefijo": archivo.prefijo ,
            "prefijoArchivo": archivo.prefijoArchivo ,
            "estado": archivo.estado ,
            "formatoId": archivo.formatoId ,
            "descripcion": archivo.descripcion ,
            "createdAt": archivo.createdAt ,
            "updatedAt": archivo.updatedAt 
      })
    })
//    return archivosEmpresaDb;
return  {archivos}

  }
}
