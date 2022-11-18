import { DateTime } from 'luxon';
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { Modulo } from 'App/Dominio/Datos/Entidades/Autenticacion/Modulo';
export default class TblModulos extends BaseModel {
  public static readonly table = 'tbl_modulos'


  @column({ isPrimary: true, columnName: 'mod_id' }) public id: string

  @column({ columnName: 'mod_nombre' }) public nombre: string

  @column({ columnName: 'mod_estado' }) public estado: boolean

  @column({ columnName: 'mod_ruta'}) public ruta: string

  @column({ columnName: 'mod_icono'}) public icono: string

  @column.dateTime({ autoCreate: true, columnName: 'mod_creacion' }) public creacion: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'mod_actualizacion' }) public actualizacion: DateTime

  public establecerModuloDb(modulo:Modulo):void{
    this.id = modulo.id
    this.nombre = modulo.nombre
    this.ruta = modulo.ruta
    this.icono = modulo.icono
    this.estado = modulo.estado
    this.creacion = modulo.creacion;
    this.actualizacion = modulo.actualizacion;
  }

  public obtenerModulo():Modulo{
    return new Modulo(
        this.id, 
        this.nombre,
        this.ruta,
        this.icono,
        this.estado,
        this.creacion,
        this.actualizacion
    )
  }
}
