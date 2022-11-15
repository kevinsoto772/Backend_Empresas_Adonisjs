/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm';
import { UsuarioEmpresa } from 'App/Dominio/Datos/Entidades/UsuarioEmpresa';
import TblVariablesEspecificas from './VariableEspecifica';

export default class TblUsuariosEmpresas extends BaseModel {
  @column({ isPrimary: true, columnName: 'use_id' })
  public id: string

  @column({ columnName: 'use_nombre' }) public nombre: string

  @column({ columnName: 'use_usuario' }) public usuario: string

  @column({ columnName: 'use_empresa_id' }) public idEmpresa: string

  @column({ columnName: 'use_clave' }) public clave: string

  @column({columnName: 'use_estado'}) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'use_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'use_actualizacion' }) public updatedAt: DateTime

  public establecerUsuarioEmpresaDb (usuarioEmpresa: UsuarioEmpresa) {
    this.id = usuarioEmpresa.id
    this.nombre = usuarioEmpresa.nombre
    this.clave = usuarioEmpresa.clave
    this.estado = usuarioEmpresa.estado
    this.usuario = usuarioEmpresa.usuario
    this.idEmpresa = usuarioEmpresa.idEmpresa
  }

  public estableceUsuarioEmpresaConId (usuarioEmpresa: UsuarioEmpresa) {
    this.clave = usuarioEmpresa.clave
    this.nombre = usuarioEmpresa.nombre
    this.estado = usuarioEmpresa.estado
    this.usuario = usuarioEmpresa.usuario
    this.idEmpresa = usuarioEmpresa.idEmpresa
  }

  public obtenerUsuarioEmpresa (): UsuarioEmpresa {
    const usuarioEmpresa = new UsuarioEmpresa()
    usuarioEmpresa.id = this.id
    usuarioEmpresa.nombre = this.nombre
    usuarioEmpresa.clave = this.clave
    usuarioEmpresa.estado = this.estado
    usuarioEmpresa.usuario = this.usuario
    usuarioEmpresa.idEmpresa = this.idEmpresa
    return usuarioEmpresa
  }

  @hasMany(() => TblVariablesEspecificas)
  public variableEspecifica: HasMany<typeof TblVariablesEspecificas>
}

