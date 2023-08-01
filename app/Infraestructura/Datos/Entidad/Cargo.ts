import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { Cargo } from 'App/Dominio/Datos/Entidades/Cargo';
export default class TblCargos extends BaseModel {
  @column({ isPrimary: true, columnName: 'car_id' })
  public id: string

  @column({ columnName: 'car_nombre' }) 
  public nombre: string

  @column({ columnName: 'car_estado' }) 
  public estado: boolean

  @column.dateTime({ autoCreate: true, columnName: 'car_creado' }) 
  public creado: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'car_actualizado' }) 
  public actualizado: DateTime

  public establecerCargoDb (cargo: Cargo) {
    this.id = cargo.id
    this.nombre = cargo.nombre
    this.estado = cargo.estado
    this.creado = cargo.creado
    this.actualizado = cargo.actualizado
  }

  public obtenerCargo (): Cargo {
    return new Cargo(
        this.id,
        this.nombre,
        this.estado,
        this.creado,
        this.actualizado
    )
  }

}
