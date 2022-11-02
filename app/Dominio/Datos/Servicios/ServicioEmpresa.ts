/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { RepositorioEmpresa } from "App/Dominio/Repositorios/RepositorioEmpresa";
import { Empresa } from "../Entidades/Empresa";

export class ServicioEmpresa{
  constructor (private repositorio: RepositorioEmpresa) { }

  async obtenerEmpresas (params: any): Promise<Empresa[]> {
    return this.repositorio.obtenerEmpresas(params);
  }

  async obtenerEmpresaPorId (id: number): Promise<Empresa>{
    return this.repositorio.obtenerEmpresaPorId(id);
  }

  async guardarEmpresa (empresa: Empresa): Promise<void>{
    return this.repositorio.guardarEmpresa(empresa);
  }

  async actualizarEmpresa (id: number, empresa: Empresa): Promise<number> {
    return this.repositorio.actualizarEmpresa(id, empresa);
  }

  async cambiarEstado (id:number):Promise<number>{
    let empresa = await this.repositorio.obtenerEmpresaPorId(id)
    empresa.estado = !empresa.estado
    return await this.repositorio.actualizarEmpresa(id, empresa);
  }
}
