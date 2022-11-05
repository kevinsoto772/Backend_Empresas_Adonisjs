/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */

import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioUsuarioNovafianza } from "App/Dominio/Repositorios/RepositorioUsuarioNovafianza";
import { UsuarioNovafianza } from "../Entidades/UsuarioNovafianza";

export class ServicioUsuarioNovafianza{
  constructor (private repositorio: RepositorioUsuarioNovafianza) { }

  async obtenerUsuariosNovafianza (params: any): Promise<{ usuariosNovafianza: UsuarioNovafianza[], paginacion: Paginador }> {
    return this.repositorio.obtenerUsuariosNovafianza(params);
  }

  async obtenerUsuarioNovafianzaPorId (id: string): Promise<UsuarioNovafianza>{
    return this.repositorio.obtenerUsuarioNovafianzaPorId(id);
  }

  async guardarUsuarioNovafianza (usuarioNovafianza: UsuarioNovafianza): Promise<void>{
    usuarioNovafianza.id = uuidv4();
    return this.repositorio.guardarUsuarioNovafianza(usuarioNovafianza);
  }

  async actualizarUsuarioNovafianza (id: string, usuarioNovafianza: UsuarioNovafianza): Promise<string> {
    return this.repositorio.actualizarUsuarioNovafianza(id, usuarioNovafianza);
  }

  async cambiarEstado (id:string):Promise<string>{
    let usuarioNovafianza = await this.repositorio.obtenerUsuarioNovafianzaPorId(id)
    usuarioNovafianza.estado = !usuarioNovafianza.estado
    return await this.repositorio.actualizarUsuarioNovafianza(id, usuarioNovafianza);
  }
}
