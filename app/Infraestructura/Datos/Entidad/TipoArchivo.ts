/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { TipoArchivo } from '../../../Dominio/Datos/Entidades/TipoArchivo';

export default class TblTipoArchivos extends BaseModel {
  @column({ isPrimary: true, columnName: 'tif_id' })
  public id: number

  @column({ columnName: 'tif_nombre' }) public nombre: string

  @column({ columnName: 'tif_valor' }) public valor: string

  @column({columnName: 'tif_estado'}) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'tif_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tif_actualizacion' }) public updatedAt: DateTime

  public establecerTipoArchivoDb (tipoArchivo: TipoArchivo) {
    this.id = tipoArchivo.id
    this.nombre = tipoArchivo.nombre
    this.valor = tipoArchivo.valor
    this.estado = tipoArchivo.estado
  }

  public establecerTipoArchivoConId (tipoArchivo: TipoArchivo) {
    this.nombre = tipoArchivo.nombre
    this.valor = tipoArchivo.valor
    this.estado = tipoArchivo.estado
  }

  public obtenerTipoArchivo (): TipoArchivo {
    const tipoArchivo = new TipoArchivo()
    tipoArchivo.id = this.id
    tipoArchivo.nombre = this.nombre
    tipoArchivo.valor = this.valor
    tipoArchivo.estado = this.estado

    return tipoArchivo
  }

}