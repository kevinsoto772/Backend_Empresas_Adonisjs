/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */

import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioArchivoEmpresa } from "App/Dominio/Repositorios/RepositorioArchivoEmpresa";
import { ArchivoEmpresa } from "../Entidades/ArchivoEmpresa";

export class ServicioArchivoEmpresa{
  constructor (private repositorio: RepositorioArchivoEmpresa) { }

  async obtenerArchivosEmpresas (params: any): Promise<{archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador}> {
    return this.repositorio.obtenerArchivosEmpresas(params);
  }

  async obtenerArchivoEmpresaPorId (id: string): Promise<ArchivoEmpresa>{
    return this.repositorio.obtenerArchivoEmpresaPorId(id);
  }

  async guardarArchivoEmpresa (archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa>{
    archivoEmpresa.id = uuidv4();
    return this.repositorio.guardarArchivoEmpresa(archivoEmpresa);
  }

  async actualizarArchivoEmpresa (id: string, archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa> {
    return this.repositorio.actualizarArchivoEmpresa(id, archivoEmpresa);
  }

  async cambiarEstado (id:string):Promise<ArchivoEmpresa>{
    let archivoEmpresa = await this.repositorio.obtenerArchivoEmpresaPorId(id)
    archivoEmpresa.estado = !archivoEmpresa.estado
    return await this.repositorio.actualizarArchivoEmpresa(id, archivoEmpresa);
  }
}
