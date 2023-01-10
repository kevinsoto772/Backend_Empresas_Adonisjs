/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */

import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioUsuarioNovafianza } from "App/Dominio/Repositorios/RepositorioUsuarioNovafianza";
import { UsuarioNovafianza } from "../Entidades/UsuarioNovafianza";
import { GenerarContrasena } from "App/Dominio/GenerarContrasena/GenerarContrasena";
import { Encriptador } from "App/Dominio/Encriptacion/Encriptador";

export class ServicioUsuarioNovafianza{
  constructor (private repositorio: RepositorioUsuarioNovafianza, private generarContraseña: GenerarContrasena, private encriptador: Encriptador) { }

  async obtenerUsuariosNovafianza (params: any): Promise<{ usuariosNovafianza: UsuarioNovafianza[], paginacion: Paginador }> {
    return this.repositorio.obtenerUsuariosNovafianza(params);
  }

  async obtenerUsuarioNovafianzaPorId (id: string): Promise<UsuarioNovafianza>{
    return this.repositorio.obtenerUsuarioNovafianzaPorId(id);
  }

  async obtenerUsuarioNovafianzaPorUsuario (nombreUsuario: string): Promise<UsuarioNovafianza | null>{
    return this.repositorio.obtenerUsuarioNovafianzaPorUsuario(nombreUsuario);
  }

  async guardarUsuarioNovafianza (usuarioNovafianza: UsuarioNovafianza): Promise<UsuarioNovafianza>{
    const clave = await this.generarContraseña.generar()
    usuarioNovafianza.id = uuidv4();
    usuarioNovafianza.clave = await this.encriptador.encriptar(clave)
    usuarioNovafianza.usuario = usuarioNovafianza.identificacion.toString()
    return this.repositorio.guardarUsuarioNovafianza(usuarioNovafianza);
  }

  async actualizarUsuarioNovafianza (id: string, usuarioNovafianza: UsuarioNovafianza): Promise<UsuarioNovafianza> {
    usuarioNovafianza.clave = await this.encriptador.encriptar(usuarioNovafianza.clave)
    return this.repositorio.actualizarUsuarioNovafianza(id, usuarioNovafianza);
  }

  async cambiarEstado (id:string):Promise<UsuarioNovafianza>{
    let usuarioNovafianza = await this.repositorio.obtenerUsuarioNovafianzaPorId(id)
    usuarioNovafianza.estado = !usuarioNovafianza.estado
    return await this.repositorio.actualizarUsuarioNovafianza(id, usuarioNovafianza);
  }
}
