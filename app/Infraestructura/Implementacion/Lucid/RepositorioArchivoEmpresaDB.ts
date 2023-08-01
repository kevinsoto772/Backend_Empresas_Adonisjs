import { Paginador } from 'App/Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioArchivoEmpresa } from 'App/Dominio/Repositorios/RepositorioArchivoEmpresa';
import { ArchivoEmpresa } from 'App/Dominio/Datos/Entidades/ArchivoEmpresa';
import TblArchivoEmpresa from '../../Datos/Entidad/ArchivoEmpresa';
import { Exception } from '@adonisjs/core/build/standalone';

export class RepositorioArchivoEmpresaDB implements RepositorioArchivoEmpresa {
  async obtenerArchivoEmpresa({ idArchivo, idEmpresa }: { idArchivo: string; idEmpresa: string; }) {
    return await TblArchivoEmpresa.query().where('are_archivo_id', idArchivo).andWhere('are_empresa_id', idEmpresa).first()
  }

  async cambiarEstadoArchivosEmpresa(idEmpresa: string, idArchivos: string[], nuevoEstado: boolean): Promise<void> {
    await TblArchivoEmpresa.query().update({
      are_estado: nuevoEstado
    }).where('are_empresa_id', idEmpresa).andWhereIn('are_archivo_id', idArchivos)
  }

  async eliminarArchivosEmpresa(idEmpresa: string, idArchivos: string[]): Promise<number> {
    const resultado = await TblArchivoEmpresa.query()
      .delete()
      .where('idEmpresa', idEmpresa)
      .andWhereIn('idArchivo', idArchivos)
    return resultado[0]
  }

  async obtenerArchivosPorEmpresa(idEmpresa: string): Promise<ArchivoEmpresa[]> {
    const archivosEmpresaDb = await TblArchivoEmpresa.query().where({ 'idEmpresa': idEmpresa })
    return archivosEmpresaDb.map(archivoEmpresaDb => {
      return archivoEmpresaDb.obtenerArchivoEmpresa()
    })
  }

  async guardarArchivosEmpresa(archivosEmpresa: ArchivoEmpresa[]): Promise<ArchivoEmpresa[]> {
    const archivosEmpresaDb = archivosEmpresa.map(archivoEmpresa => {
      const archivoEmpresaDb = new TblArchivoEmpresa()
      archivoEmpresaDb.establecerArchivoEmpresaDb(archivoEmpresa)
      return archivoEmpresaDb
    })
    return (await TblArchivoEmpresa.createMany(archivosEmpresaDb)).map(archivoEmpresaDbGuardado => {
      return archivoEmpresaDbGuardado.obtenerArchivoEmpresa()
    })
  }

  async obtenerArchivosEmpresas(params: any): Promise<{ archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador }> {
    const archivosEmpresas: ArchivoEmpresa[] = []
    const archivosEmpresasDB = await TblArchivoEmpresa.query().orderBy('id', 'desc').paginate(params.pagina, params.limite)
    archivosEmpresasDB.forEach(archivosEmpresasDB => {
      archivosEmpresas.push(archivosEmpresasDB.obtenerArchivoEmpresa())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(archivosEmpresasDB)
    return { archivosEmpresas, paginacion }
  }

  async obtenerArchivoEmpresaPorId(id: string): Promise<ArchivoEmpresa> {
    try{
      const archivoEmpresa = await TblArchivoEmpresa.findOrFail(id)
      return archivoEmpresa.obtenerArchivoEmpresa()  
    }catch{
      throw new Exception('No se encontró el archivo empresa con id: ' + id, 404)
    }
  }

  async guardarArchivoEmpresa(archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa> {
    let archivoEmpresaDB = new TblArchivoEmpresa()
    archivoEmpresaDB.establecerArchivoEmpresaDb(archivoEmpresa)
    await archivoEmpresaDB.save()
    return archivoEmpresaDB
  }

  async actualizarArchivoEmpresa(id: string, archivoEmpresa: ArchivoEmpresa): Promise<any> {
    try {
      let archivoEmpresaRetorno = await TblArchivoEmpresa.findOrFail(id)
      archivoEmpresaRetorno.establecerArchivoEmpresaConId(archivoEmpresa)
      return await archivoEmpresaRetorno.save()
    } catch (error) {
      console.error(error);
    }
  }
}
