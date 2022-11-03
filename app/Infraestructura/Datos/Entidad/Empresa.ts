/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { Empresa } from '../../../Dominio/Datos/Entidades/Empresa';

export default class Tblempresas extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'emp_nombre' }) public nombre: string

  @column({ columnName: 'emp_nit' }) public nit: number

  @column({columnName: 'emp_estado'}) public estado: boolean

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  public establecerEmpresaDb (empresa: Empresa) {
    this.nombre = empresa.nombre
    this.nit = empresa.nit
    this.estado = empresa.estado
  }

  public establecerEmpresaConId (empresa: Empresa) {
    this.nombre = empresa.nombre
    this.nit = empresa.nit
    this.estado = empresa.estado
  }

  public obtenerEmpresa (): Empresa {
    const empresa = new Empresa()
    empresa.id = this.id
    empresa.nombre = this.nombre
    empresa.nit = this.nit
    empresa.estado = this.estado

    return empresa
  }
}
