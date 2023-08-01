import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioUsuarioEmpresa } from "App/Dominio/Repositorios/RepositorioUsuarioEmpresa";
import { UsuarioEmpresa } from "../Entidades/UsuarioEmpresa";
import { GeneradorContrasena } from "App/Dominio/GenerarContrasena/GenerarContrasena";
import { Encriptador } from "App/Dominio/Encriptacion/Encriptador";
import { EnviadorEmail } from "App/Dominio/Email/EnviadorEmail";
import Env from "@ioc:Adonis/Core/Env"
import { EmailBienvenida } from "App/Dominio/Email/Emails/EmailBienvenida";

export class ServicioUsuarioEmpresa{
  constructor (
    private repositorio: RepositorioUsuarioEmpresa, 
    private generarContrasena: GeneradorContrasena, 
    private encriptador: Encriptador,
    private enviadorEmail: EnviadorEmail
  ) { }

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
    const usuario = await this.repositorio.guardarUsuarioEmpresa(usuarioEmpresa);
    await this.enviadorEmail.enviarTemplate({
      asunto: 'Bienvenido al portal de autogestión de Novafianza S.A.S',
      destinatarios: usuario.correo,
      de: Env.get('SMTP_USERNAME')
    }, new EmailBienvenida({
      nombre: usuario.nombre,
      clave: clave,
      usuario: usuario.identificacion
    }))
    return usuario
  }

  async actualizarUsuarioEmpresa (id: string, usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
    usuarioEmpresa.clave = await this.encriptador.encriptar(usuarioEmpresa.clave)
    return this.repositorio.actualizarUsuarioEmpresa(id, usuarioEmpresa);
  }

  async actualizaUsuarioEmpresa (id: string, usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
       return this.repositorio.actualizaUsuarioEmpresa(id, usuarioEmpresa);
  }

  async obtenerUsuarioEmpresaPorUsuario (nombreUsuario: string): Promise<UsuarioEmpresa | null>{
    return this.repositorio.obtenerUsuarioEmpresaPorUsuario(nombreUsuario);
  }

  async cambiarEstado (id:string):Promise<UsuarioEmpresa>{
    let usuarioEmpresa = await this.repositorio.obtenerUsuarioEmpresaPorId(id)
    usuarioEmpresa.estado = !usuarioEmpresa.estado
    return await this.repositorio.actualizarUsuarioEmpresa(id, usuarioEmpresa);
  }

  async obtenerUsuariosEmpresaPorIdEmpresa (params: any): Promise<{ usuariosEmpresa: UsuarioEmpresa[], paginacion: Paginador }> {
    return this.repositorio.obtenerUsuariosEmpresaPorIdEmpresa(params);
  }

  async  buscar (parametros: string): Promise<{}> {
    return this.repositorio.buscar(parametros)
  }


}
