/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */

import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioUsuarioEmpresa } from "App/Dominio/Repositorios/RepositorioUsuarioEmpresa";
import { UsuarioEmpresa } from "../Entidades/UsuarioEmpresa";
import { GeneradorContrasena } from "App/Dominio/GenerarContrasena/GenerarContrasena";
import { Encriptador } from "App/Dominio/Encriptacion/Encriptador";

export class ServicioUsuarioEmpresa{
  constructor (private repositorio: RepositorioUsuarioEmpresa, private generarContrasena: GeneradorContrasena, private encriptador: Encriptador) { }

  async obtenerUsuariosEmpresa (params: any): Promise<{ usuariosEmpresa: UsuarioEmpresa[], paginacion: Paginador }> {
    return this.repositorio.obtenerUsuariosEmpresa(params);
  }

  async obtenerUsuarioEmpresaPorId (id: string): Promise<UsuarioEmpresa>{
    return this.repositorio.obtenerUsuarioEmpresaPorId(id);
  }

  async guardarUsuarioEmpresa (usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa>{
    const clave = await this.generarContrasena.generar()
    usuarioEmpresa.id = uuidv4();
    usuarioEmpresa.clave = await this.encriptador.encriptar(clave)
    usuarioEmpresa.usuario = usuarioEmpresa.identificacion.toString()
    return this.repositorio.guardarUsuarioEmpresa(usuarioEmpresa);
  }

  async actualizarUsuarioEmpresa (id: string, usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
    usuarioEmpresa.clave = await this.encriptador.encriptar(usuarioEmpresa.clave)
    return this.repositorio.actualizarUsuarioEmpresa(id, usuarioEmpresa);
  }

  async obtenerUsuarioEmpresaPorUsuario (nombreUsuario: string): Promise<UsuarioEmpresa | null>{
    return this.repositorio.obtenerUsuarioEmpresaPorUsuario(nombreUsuario);
  }

  async cambiarEstado (id:string):Promise<UsuarioEmpresa>{
    let usuarioEmpresa = await this.repositorio.obtenerUsuarioEmpresaPorId(id)
    usuarioEmpresa.estado = !usuarioEmpresa.estado
    return await this.repositorio.actualizarUsuarioEmpresa(id, usuarioEmpresa);
  }
}
