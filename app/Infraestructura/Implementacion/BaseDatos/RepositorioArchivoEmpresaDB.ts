/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Paginador } from 'App/Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioArchivoEmpresa } from 'App/Dominio/Repositorios/RepositorioArchivoEmpresa';
import { ArchivoEmpresa } from 'App/Dominio/Datos/Entidades/ArchivoEmpresa';
import TblArchivoEmpresa from '../../Datos/Entidad/ArchivoEmpresa';

export class RepositorioArchivoEmpresaDB implements RepositorioArchivoEmpresa {
  async obtenerArchivosEmpresas (params: any): Promise<{archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador}> {
    const archivosEmpresas: ArchivoEmpresa[] = []
    const archivosEmpresasDB = await TblArchivoEmpresa.query().orderBy('id', 'desc').paginate(params.pagina, params.limite)
    archivosEmpresasDB.forEach(archivosEmpresasDB => {
      archivosEmpresas.push(archivosEmpresasDB.obtenerArchivoEmpresa())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(archivosEmpresasDB)
    return {archivosEmpresas , paginacion}
  }

  async obtenerArchivoEmpresaPorId (id: string): Promise<ArchivoEmpresa> {
    const archivoEmpresa = await TblArchivoEmpresa.findOrFail(id)
    return archivoEmpresa.obtenerArchivoEmpresa()
  }

  async guardarArchivoEmpresa (archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa> {
    let archivoEmpresaDB = new TblArchivoEmpresa()
    archivoEmpresaDB.establecerArchivoEmpresaDb(archivoEmpresa)
    await archivoEmpresaDB.save()
    return archivoEmpresaDB
  }

  async actualizarArchivoEmpresa (id: string, archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa> {
    let archivoEmpresaRetorno = await TblArchivoEmpresa.findOrFail(id)
    archivoEmpresaRetorno.establecerArchivoEmpresaConId(archivoEmpresa)
    await archivoEmpresaRetorno.save()
    return archivoEmpresaRetorno
  }
}
