/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo';
import TblEmpresas from './Empresa';
import TblArchivosVariables from './ArchivoVariable';

export default class TblArchivos extends BaseModel {
  @column({ isPrimary: true, columnName: 'arc_id' })
  public id: string

  @column({ columnName: 'arc_nombre' }) public nombre: string

  @column({ columnName: 'arc_tipo' }) public tipo: string

  @column({ columnName: 'arc_estado' }) public estado: boolean

  @column({columnName: 'arc_empresa_id'}) public idEmpresa: string

  @column.dateTime({ autoCreate: true, columnName: 'arc_creacion' }) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'arc_actualizacion' }) public updatedAt: DateTime

  public establecerArchivoDb (archivo: Archivo) {
    this.id = archivo.id
    this.nombre = archivo.nombre
    this.tipo = archivo.tipo
    this.estado = archivo.estado
    this.idEmpresa = archivo.idEmpresa
  }

  public establecerArchivoConId (archivo: Archivo) {
    this.nombre = archivo.nombre
    this.tipo = archivo.tipo
    this.estado = archivo.estado
    this.idEmpresa = archivo.idEmpresa
  }

  public obtenerArchivo (): Archivo {
    const archivo = new Archivo()
    archivo.id = this.id
    archivo.nombre = this.nombre
    archivo.tipo = this.tipo
    archivo.estado = this.estado
    archivo.idEmpresa = this.idEmpresa

    return archivo
  }

  @belongsTo(() => TblEmpresas, {
    localKey: 'id',
    foreignKey: 'idEmpresa',
  })
  public empresa: BelongsTo<typeof TblEmpresas>

  @hasMany(() => TblArchivosVariables)
  public archivoVariable: HasMany<typeof TblArchivosVariables>
}
