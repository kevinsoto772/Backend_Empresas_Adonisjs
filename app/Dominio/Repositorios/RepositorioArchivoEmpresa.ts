/* eslint-disable @typescript-eslint/semi */
import { ArchivoEmpresa } from '../Datos/Entidades/ArchivoEmpresa';
import { Paginador } from '../Paginador';

export interface RepositorioArchivoEmpresa {
  obtenerArchivosEmpresas(param: any): Promise<{archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador}>
  obtenerArchivoEmpresaPorId(id: string): Promise<ArchivoEmpresa>
  guardarArchivoEmpresa(archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa>
  actualizarArchivoEmpresa(id: string, archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa>
}

