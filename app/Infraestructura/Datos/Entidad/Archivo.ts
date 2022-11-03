/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivos';
import Tblempresas from './Empresa';

export default class Tblarchivos extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'arch_nombre' }) public nombre: string

  @column({ columnName: 'arch_estado' }) public estado: boolean

  @column({columnName: 'arch_empresa_id'}) public idEmpresa: string

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  public establecerArchivoDb (archivo: Archivo) {
    this.id = archivo.id
    this.nombre = archivo.nombre
    this.estado = archivo.estado
    this.idEmpresa = archivo.idEmpresa
  }

  public establecerArchivoConId (archivo: Archivo) {
    this.nombre = archivo.nombre
    this.estado = archivo.estado
    this.idEmpresa = archivo.idEmpresa
  }

  public obtenerArchivo (): Archivo {
    const archivo = new Archivo()
    archivo.id = this.id
    archivo.nombre = this.nombre
    archivo.estado = this.estado
    archivo.idEmpresa = this.idEmpresa

    return archivo
  }

  @belongsTo(() => Tblempresas, {
    localKey: 'id',
    foreignKey: 'idEmpresa',
  })
  public empresa: BelongsTo<typeof Tblempresas>
}
