/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioRol } from 'App/Dominio/Repositorios/RepositorioRol'
import { Rol } from '../Entidades/Autenticacion/Rol'

export class ServicioRol{
  constructor (private repositorio: RepositorioRol) { }

  async obtenerRolporID (id: string): Promise<Rol>{
    return this.repositorio.obtenerRolporID(id)
  }
}
