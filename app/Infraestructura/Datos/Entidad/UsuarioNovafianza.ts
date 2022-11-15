/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { UsuarioNovafianza } from 'App/Dominio/Datos/Entidades/UsuarioNovafianza';

export default class TblUsuariosNovafianzas extends BaseModel {
  @column({ isPrimary: true, columnName: 'usn_id' })
  public id: string

  @column({ columnName: 'usn_nombre' }) public nombre: string

  @column({ columnName: 'usn_usuario' }) public usuario: string

  @column({ columnName: 'usn_clave' }) public clave: string

  @column({columnName: 'usn_estado'}) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'usn_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'usn_actualizacion' }) public updatedAt: DateTime

  public establecerUsuarioNovafianzaDb (usuarioNovafianza: UsuarioNovafianza) {
    this.id = usuarioNovafianza.id
    this.nombre = usuarioNovafianza.nombre
    this.usuario = usuarioNovafianza.usuario
    this.clave = usuarioNovafianza.clave
    this.estado = usuarioNovafianza.estado
  }

  public estableceUsuarioNovafianzaConId (usuarioNovafianza: UsuarioNovafianza) {
    this.nombre = usuarioNovafianza.nombre
    this.usuario = usuarioNovafianza.usuario
    this.clave = usuarioNovafianza.clave
    this.estado = usuarioNovafianza.estado
  }

  public obtenerUsuarioNovafianza (): UsuarioNovafianza {
    const usuarioNovafianza = new UsuarioNovafianza()
    usuarioNovafianza.id = this.id
    usuarioNovafianza.nombre = this.nombre
    usuarioNovafianza.usuario = this.usuario
    usuarioNovafianza.clave = this.clave
    usuarioNovafianza.estado = this.estado

    return usuarioNovafianza
  }
}
