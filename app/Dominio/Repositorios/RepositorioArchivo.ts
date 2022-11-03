/* eslint-disable @typescript-eslint/semi */
import { Archivo } from '../Datos/Entidades/Archivos';
import { Paginador } from '../Paginador';

export interface RepositorioArchivo {
  obtenerArchivos(param: any): Promise<{archivos: Archivo[], paginacion: Paginador}>
  obtenerArchivoPorId(id: string): Promise<Archivo>
  guardarArchivo(archivo: Archivo): Promise<void>
  actualizarArchivo(id: string, archivo: Archivo): Promise<string>
}

