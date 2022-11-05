/* eslint-disable @typescript-eslint/semi */
import { UsuarioNovafianza } from '../Datos/Entidades/UsuarioNovafianza';
import { Paginador } from '../Paginador';

export interface RepositorioUsuarioNovafianza {
  obtenerUsuariosNovafianza(param: any): Promise<{usuariosNovafianza: UsuarioNovafianza[], paginacion: Paginador}>
  obtenerUsuarioNovafianzaPorId(id: string): Promise<UsuarioNovafianza>
  guardarUsuarioNovafianza(usuarioNovafianza: UsuarioNovafianza): Promise<void>
  actualizarUsuarioNovafianza(id: string, usuarioNovafianza: UsuarioNovafianza): Promise<string>
}
