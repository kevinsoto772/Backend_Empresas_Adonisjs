/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Paginador } from 'App/Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioUsuarioEmpresa } from '../../../Dominio/Repositorios/RepositorioUsuarioEmpresa';
import { UsuarioEmpresa } from 'App/Dominio/Datos/Entidades/UsuarioEmpresa';
import TblUsuariosEmpresas from 'App/Infraestructura/Datos/Entidad/UsuarioEmpresa';

export class RepositorioUsuarioEmpresaDB implements RepositorioUsuarioEmpresa {
  async obtenerUsuariosEmpresa (params: any): Promise<{usuariosEmpresa: UsuarioEmpresa[], paginacion: Paginador}> {
    const usuariosEmpresa: UsuarioEmpresa[] = []
    const usuariosEmpresaDB = await TblUsuariosEmpresas.query().orderBy('id', 'desc').paginate(params.pagina, params.limite)
    usuariosEmpresaDB.forEach(usuariosEmpresaDB => {
      usuariosEmpresa.push(usuariosEmpresaDB.obtenerUsuarioEmpresa())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(usuariosEmpresaDB)
    return {usuariosEmpresa , paginacion}
  }

  async obtenerUsuarioEmpresaPorId (id: string): Promise<UsuarioEmpresa> {
    const usuarioEmpresa = await TblUsuariosEmpresas.findOrFail(id)
    return usuarioEmpresa.obtenerUsuarioEmpresa()
  }

  async guardarUsuarioEmpresa (usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
    let usuarioEmpresaDB = new TblUsuariosEmpresas()
    usuarioEmpresaDB.establecerUsuarioEmpresaDb(usuarioEmpresa)
    await usuarioEmpresaDB.save()
    return usuarioEmpresaDB
  }

  async obtenerUsuarioEmpresaPorUsuario (nombreUsuario: string): Promise<UsuarioEmpresa | null>{
    const usuario = await TblUsuariosEmpresas.query().where('usuario', '=', nombreUsuario).first()
    if(usuario){
      return usuario!.obtenerUsuarioEmpresa()
    }
    return null
  }

  async actualizarUsuarioEmpresa (id: string, usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
    let usuarioEmpresaRetorno = await TblUsuariosEmpresas.findOrFail(id)
    usuarioEmpresaRetorno.estableceUsuarioEmpresaConId(usuarioEmpresa)
    await usuarioEmpresaRetorno.save()
    return usuarioEmpresaRetorno
  }

  async actualizaUsuarioEmpresa (id: string, usuarioEmpresa: UsuarioEmpresa): Promise<UsuarioEmpresa> {
    let usuarioEmpresaRetorno = await TblUsuariosEmpresas.findOrFail(id)
    usuarioEmpresaRetorno.establecerUsuarioEmpresaConId(usuarioEmpresa)
    await usuarioEmpresaRetorno.save()
    return usuarioEmpresaRetorno
  }

  async obtenerUsuariosEmpresaPorIdEmpresa (params: any): Promise<{usuariosEmpresa: UsuarioEmpresa[], paginacion: Paginador}> {
    const usuariosEmpresa: UsuarioEmpresa[] = []
    const usuariosEmpresaDB = await TblUsuariosEmpresas.query().where('use_empresa_id', params.idEmpresa).orderBy('id', 'desc').paginate(params.pagina, params.limite)
    usuariosEmpresaDB.forEach(usuariosEmpresaDB => {
      usuariosEmpresa.push(usuariosEmpresaDB.obtenerUsuarioEmpresa())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(usuariosEmpresaDB)
    return {usuariosEmpresa , paginacion}
  }

  async buscar (params: string): Promise<{usuarioEmpresa: UsuarioEmpresa[], paginacion: Paginador}> {
    const { entidadId, pagina = 1, limite = 5, frase } = JSON.parse(params);

    const usuarioEmpresa: UsuarioEmpresa[] = []
    const usuariosEmpresaDB = await TblUsuariosEmpresas.query()
        .where('use_empresa_id', entidadId)
        .whereILike('use_nombre', `%${frase}%`)
        .orWhereILike('use_apellido', `%${frase}%`)
        .orWhereILike('use_identificacion', `%${frase}%`)
        .orWhereILike('use_correo', `%${frase}%`)
        .paginate(pagina, limite)

  
        usuariosEmpresaDB.forEach(usuarioEmpresaDB => {
          usuarioEmpresa.push(usuarioEmpresaDB.obtenerUsuarioEmpresa())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(usuariosEmpresaDB)
    return {usuarioEmpresa , paginacion}
  }

}
