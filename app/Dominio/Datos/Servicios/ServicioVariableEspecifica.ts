/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import { Paginador } from "App/Dominio/Paginador";
import { RepositorioVariableEspecifica } from "App/Dominio/Repositorios/RepositorioVariableEspecifica";
import { VariableEspecifica } from '../Entidades/VariableEspecifica';
import { v4 as uuidv4 } from 'uuid';

export class ServicioVariableEspecifica{
  constructor (private repositorio: RepositorioVariableEspecifica) { }

  async obtenerVariablesEspecificas (params: any): Promise<{variablesEspecificas: VariableEspecifica[], paginacion: Paginador}> {
    return this.repositorio.obtenerVariablesEspecificas(params);
  }

  async obtenerVariableEspecificaPorId (id: string): Promise<VariableEspecifica>{
    return this.repositorio.obtenerVariableEspecificaPorId(id);
  }

  async guardarVariableEspecifica (variableEspecifica: VariableEspecifica): Promise<void>{
    variableEspecifica.id = uuidv4();
    return this.repositorio.guardarVariableEspecifica(variableEspecifica);
  }

  async actualizarVariableEspecifica (id: string, variableEspecifica: VariableEspecifica): Promise<string> {
    return this.repositorio.actualizarVariableEspecifica(id, variableEspecifica);
  }

  async cambiarEstado (id:string):Promise<string>{
    let variableEspecifica = await this.repositorio.obtenerVariableEspecificaPorId(id)
    variableEspecifica.estado = !variableEspecifica.estado
    return await this.repositorio.actualizarVariableEspecifica(id, variableEspecifica);
  }

  async cambiarMaestra (id:string):Promise<string>{
    let variableEspecifica = await this.repositorio.obtenerVariableEspecificaPorId(id)
    variableEspecifica.maestra = !variableEspecifica.maestra
    return await this.repositorio.actualizarVariableEspecifica(id, variableEspecifica);
  }

  async cambiarObligatoria (id:string):Promise<string>{
    let variableEspecifica = await this.repositorio.obtenerVariableEspecificaPorId(id)
    variableEspecifica.obligatoria = !variableEspecifica.obligatoria
    return await this.repositorio.actualizarVariableEspecifica(id, variableEspecifica);
  }
}
