/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo';
import TblTipoArchivos from './TipoArchivo';
import TblFormatoArchivo from './FormatoArchivo';
import TblEmpresas from './Empresa';
export default class TblArchivos extends BaseModel {
  @column({ isPrimary: true, columnName: 'arc_id' })
  public id: string

  @column({ columnName: 'arc_nombre' }) public nombre: string

  @column({ columnName: 'arc_tipo' }) public tipo: string

  @column({ columnName: 'arc_estado' }) public estado: boolean

  @column({ columnName: 'arc_prefijo' }) public prefijo: string

  @column({ columnName: 'arc_prefijo_archivo' }) public prefijoArchivo: string

  @column({ columnName: 'arc_formato_id' }) public formatoId: string

  @column({ columnName: 'arc_descripcion' }) public descripcion?: string

  @column.dateTime({ autoCreate: true, columnName: 'arc_creacion' }) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'arc_actualizacion' }) public updatedAt: DateTime

  public establecerArchivoDb (archivo: Archivo) {
    this.id = archivo.id
    this.nombre = archivo.nombre
    this.tipo = archivo.tipo
    this.prefijo = archivo.prefijo
    this.prefijoArchivo = archivo.prefijoArchivo
    this.estado = archivo.estado
    this.formatoId = archivo.formatoId
    this.descripcion = archivo.descripcion
  }

  public establecerArchivoConId (archivo: Archivo) {
    this.nombre = archivo.nombre
    this.tipo = archivo.tipo
    this.prefijo = archivo.prefijo
    this.prefijoArchivo = archivo.prefijoArchivo
    this.estado = archivo.estado
    this.formatoId = archivo.formatoId
    this.descripcion = archivo.descripcion
  }

  public obtenerArchivo (): Archivo {
    const archivo = new Archivo()
    archivo.id = this.id
    archivo.nombre = this.nombre
    archivo.tipo = this.tipo
    archivo.prefijo = this.prefijo
    archivo.prefijoArchivo = this.prefijoArchivo
    archivo.estado = this.estado
    archivo.formatoId = this.formatoId
    archivo.descripcion = this.descripcion
    archivo.createdAt = this.createdAt
    archivo.updatedAt = this.updatedAt
    return archivo
  }

  @hasMany(() => TblTipoArchivos, {
    localKey: 'tipo',
    foreignKey: 'id',
  })
  public tipoArchivo: HasMany<typeof TblTipoArchivos>

  @hasMany(() => TblFormatoArchivo, {
    localKey: 'formatoId',
    foreignKey: 'id',
  })
  public formato: HasMany<typeof TblFormatoArchivo>

  @manyToMany(() => TblEmpresas, {
    localKey: 'id',
    pivotForeignKey: 'are_archivo_id',
    relatedKey: 'id',
    pivotRelatedForeignKey:  'are_empresa_id',
    pivotTable: 'tbl_archivos_empresas'

  })

  public ArchivosEmpresa: ManyToMany<typeof TblEmpresas>

}
