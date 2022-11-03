/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { Paginador } from "App/Dominio/Paginador";
import { RepositorioArchivo } from '../../Repositorios/RepositorioArchivo';
import { Archivo } from "../Entidades/Archivos";
import { v4 as uuidv4 } from 'uuid';

export class ServicioArchivo{
  constructor (private repositorio: RepositorioArchivo) { }

  async obtenerArchivos (params: any): Promise<{archivos: Archivo[], paginacion: Paginador}> {
    return this.repositorio.obtenerArchivos(params);
  }

  async obtenerArchivoPorId (id: string): Promise<Archivo>{
    return this.repositorio.obtenerArchivoPorId(id);
  }

  async guardarArchivo (archivo: Archivo): Promise<void>{
    archivo.id = uuidv4();
    return this.repositorio.guardarArchivo(archivo);
  }

  async actualizarArchivo (id: string, archivo: Archivo): Promise<string> {
    return this.repositorio.actualizarArchivo(id, archivo);
  }

  async cambiarEstado (id:string):Promise<string>{
    let archivo = await this.repositorio.obtenerArchivoPorId(id)
    archivo.estado = !archivo.estado
    return await this.repositorio.actualizarArchivo(id, archivo);
  }
}
