/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm';
import { Empresa } from '../../../Dominio/Datos/Entidades/Empresa';
import TblUsuariosEmpresas from './UsuarioEmpresa';
import TblArchivos from './Archivo';
export default class TblEmpresas extends BaseModel {
  @column({ isPrimary: true, columnName: 'emp_id' })
  public id: string

  @column({ columnName: 'emp_nombre' }) public nombre: string

  @column({ columnName: 'emp_nit' }) public nit: string

  @column({ columnName: 'emp_logo' }) public logo: string

  @column({columnName: 'emp_estado'}) public estado: boolean

  @column({columnName: 'emp_convenio'}) public convenio: string

  @column.dateTime({ autoCreate: true , columnName: 'emp_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'emp_actualizacion' }) public updatedAt: DateTime

  public establecerEmpresaDb (empresa: Empresa) {
    this.id = empresa.id
    this.nombre = empresa.nombre
    this.nit = empresa.nit
    this.logo = empresa.logo
    this.convenio = empresa.convenio
    this.estado = empresa.estado
  }

  public establecerEmpresaConId (empresa: Empresa) {
    this.nombre = empresa.nombre
    this.nit = empresa.nit
    this.convenio = empresa.convenio
    this.logo = empresa.logo
    this.estado = empresa.estado
  }

  public obtenerEmpresa (): Empresa {
    const empresa = new Empresa()
    empresa.id = this.id
    empresa.nombre = this.nombre
    empresa.nit = this.nit
    empresa.logo = this.logo
    empresa.estado = this.estado
    empresa.convenio = this.convenio
    return empresa
  }

  //hasMany

  @hasMany(() => TblUsuariosEmpresas)
  public UsuarioEmpresa: HasMany<typeof TblUsuariosEmpresas>


  @manyToMany(() => TblArchivos, {
    localKey: 'id',
    pivotForeignKey: 'are_empresa_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'are_archivo_id',
    pivotTable: 'tbl_archivos_empresas'

  })

  public ArchivosEmpresa: ManyToMany<typeof TblArchivos>
}
