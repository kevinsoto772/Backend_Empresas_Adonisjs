/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { Maestra } from "../Entidades/Maestra";
import { Paginador } from "App/Dominio/Paginador";
import { RepositorioMaestra } from "App/Dominio/Repositorios/RepositorioMaestra";
import { v4 as uuidv4 } from 'uuid'

export class ServicioMaestra{
  constructor (private repositorio: RepositorioMaestra) { }

  async obtenerMaestras (params: any): Promise<{ maestras: Maestra[], paginacion: Paginador }> {
    return this.repositorio.obtenerMaestras(params);
  }

  async obtenerMaestraPorId (id: string): Promise<Maestra>{
    return this.repositorio.obtenerMaestraPorId(id);
  }

  async guardarMaestra (maestra: Maestra): Promise<void>{
    maestra.id = uuidv4();
    return this.repositorio.guardarMaestra(maestra);
  }

  async actualizarMaestra (id: string, maestra: Maestra): Promise<string> {
    return this.repositorio.actualizarMaestra(id, maestra);
  }

  async cambiarEstado (id:string):Promise<string>{
    let maestra = await this.repositorio.obtenerMaestraPorId(id)
    maestra.estado = !maestra.estado
    return await this.repositorio.actualizarMaestra(id, maestra);
  }

  async cambiarTipo (id:string):Promise<string>{
    let maestra = await this.repositorio.obtenerMaestraPorId(id)
    maestra.tipo = !maestra.tipo
    return await this.repositorio.actualizarMaestra(id, maestra);
  }
}
