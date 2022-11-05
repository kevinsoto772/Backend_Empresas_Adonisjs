/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { Paginador } from "App/Dominio/Paginador";
import { RepositorioEmpresa } from "App/Dominio/Repositorios/RepositorioEmpresa";
import { Empresa } from "../Entidades/Empresa";
import { v4 as uuidv4 } from 'uuid'

export class ServicioEmpresa{
  constructor (private repositorio: RepositorioEmpresa) { }

  async obtenerEmpresas (params: any): Promise<{ empresas: Empresa[], paginacion: Paginador }> {
    return this.repositorio.obtenerEmpresas(params);
  }

  async obtenerEmpresaPorId (id: string): Promise<Empresa>{
    return this.repositorio.obtenerEmpresaPorId(id);
  }

  async guardarEmpresa (empresa: Empresa): Promise<Empresa>{
    empresa.id = uuidv4();
    return this.repositorio.guardarEmpresa(empresa);
  }

  async actualizarEmpresa (id: string, empresa: Empresa): Promise<Empresa> {
    return this.repositorio.actualizarEmpresa(id, empresa);
  }

  async cambiarEstado (id:string):Promise<Empresa>{
    let empresa = await this.repositorio.obtenerEmpresaPorId(id)
    empresa.estado = !empresa.estado
    return await this.repositorio.actualizarEmpresa(id, empresa);
  }
}
