/* eslint-disable @typescript-eslint/semi */
import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { CargaArchivo } from 'App/Dominio/Datos/Entidades/CargaArchivo';
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo';
import TblEstadoCargas from './EstadoCarga';
export default class TblCargaDatos extends BaseModel {

  @column({ isPrimary: true, columnName: 'car_id' }) public id: string

  @column({ columnName: 'car_nombre' }) public nombre: string

  @column({ columnName: 'car_estado' }) public estado: boolean

  @column({ columnName: 'car_fecha_inicial' }) public fechaInicial: DateTime
  @column({ columnName: 'car_fecha_final' }) public fechaFinal: DateTime
  @column({ columnName: 'car_usuario_id' }) public usuario: string
  @column({ columnName: 'car_archivo_id' }) public tipoArchivo: string
  @column({ columnName: 'car_registros_encontrados' }) public registrosEncontrados: number
  @column({ columnName: 'car_estado_proceso_id' }) public estadoProceso: number
  @column({ columnName: 'car_estado_estructura_id' }) public estadoEstructura: number
  @column({ columnName: 'car_registros_fallidos' }) public registrosFallidos: number
  @column({ columnName: 'car_registros_insertados' }) public registrosInsertados: number
  @column({ columnName: 'car_empresa_id' }) public empresa: string
  @column({ columnName: 'car_registros_fallidos_safix' }) public registrosFallidosSafix: number
  @column({ columnName: 'car_registros_aprobados_safix' }) public registrosAprobadosSafix: number
  @column({ columnName: 'car_automatico' }) public automatico: boolean

  @column.dateTime({ autoCreate: true, columnName: 'car_creacion' }) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'car_actualizacion' }) public updatedAt: DateTime

  public establecerCargaArcivoDb(cargaArchivo: CargaArchivo) {
    this.id = cargaArchivo.id
    this.nombre = cargaArchivo.nombre
    this.fechaInicial = cargaArchivo.fechaInicial
    this.fechaFinal = cargaArchivo.fechaFinal
    this.usuario = cargaArchivo.usuario
    this.tipoArchivo = cargaArchivo.tipoArchivo
    this.estadoProceso = cargaArchivo.estadoProceso
    this.estadoEstructura = cargaArchivo.estadoEstructura
    this.registrosEncontrados = cargaArchivo.registrosEncontrados ?? 0
    this.registrosFallidos = cargaArchivo.registrosFallidos ?? 0
    this.registrosInsertados = cargaArchivo.registrosInsertados ?? 0
    this.estado = cargaArchivo.estado ?? true
    this.empresa = cargaArchivo.empresa ?? ''
    this.registrosFallidosSafix = cargaArchivo.registrosFallidosSafix ?? 0
    this.registrosAprobadosSafix = cargaArchivo.registrosAprobadosSafix ?? 0
    this.automatico = cargaArchivo.automatico
  }

  public establecerCargaArcivoConId(cargaArchivo: CargaArchivo) {
    this.nombre = cargaArchivo.nombre
    this.fechaInicial = cargaArchivo.fechaInicial
    this.fechaFinal = cargaArchivo.fechaFinal
    this.usuario = cargaArchivo.usuario
    this.tipoArchivo = cargaArchivo.tipoArchivo
    this.estadoProceso = cargaArchivo.estadoProceso
    this.estadoEstructura = cargaArchivo.estadoEstructura
    this.registrosEncontrados = cargaArchivo.registrosEncontrados ?? 0
    this.registrosFallidos = cargaArchivo.registrosFallidos ?? 0
    this.registrosInsertados = cargaArchivo.registrosInsertados ?? 0
    this.estado = cargaArchivo.estado ?? true
    this.empresa = cargaArchivo.empresa ?? ''
    this.registrosFallidosSafix = cargaArchivo.registrosFallidosSafix ?? 0
    this.registrosAprobadosSafix = cargaArchivo.registrosAprobadosSafix ?? 0
    this.automatico = cargaArchivo.automatico
  }

  public obtenerCargaArcivo(): CargaArchivo {
    const cargaArchivo = new CargaArchivo()
    cargaArchivo.nombre = this.nombre
    cargaArchivo.fechaInicial = this.fechaInicial
    cargaArchivo.fechaFinal = this.fechaFinal
    cargaArchivo.usuario = this.usuario
    cargaArchivo.tipoArchivo = this.tipoArchivo
    cargaArchivo.estadoProceso = this.estadoProceso
    cargaArchivo.estadoEstructura = this.estadoEstructura
    cargaArchivo.registrosEncontrados = this.registrosEncontrados
    cargaArchivo.registrosFallidos = this.registrosFallidos
    cargaArchivo.registrosInsertados = this.registrosInsertados
    cargaArchivo.estado = this.estado
    cargaArchivo.empresa = this.empresa
    cargaArchivo.registrosFallidosSafix = this.registrosFallidosSafix
    cargaArchivo.registrosAprobadosSafix = this.registrosAprobadosSafix
    cargaArchivo.automatico = this.automatico
    return cargaArchivo
  }

  public actualizarEstadoCargaEstructura(estado: number, encontrados?:number,fallidos?:number) {
    this.estadoEstructura = estado
    if(encontrados){
    this.registrosEncontrados= encontrados?? 0
    this.registrosFallidos = fallidos?? 0  
    this.registrosInsertados = this.registrosEncontrados - this.registrosFallidos
    }
   }

  public actualizarEstadoCargaService(estado: number, encontrados?:number,fallidos?:number) {
    this.estadoProceso = estado
    if(encontrados){
      this.registrosEncontrados= encontrados?? 0
      this.registrosFallidosSafix = fallidos?? 0  
      this.registrosAprobadosSafix = this.registrosEncontrados - this.registrosFallidos
      }
  }

  @belongsTo(() => Tblarchivos, {
    localKey: 'id',
    foreignKey: 'tipoArchivo'
  })
  public archivo: BelongsTo<typeof Tblarchivos>


  @belongsTo(() => TblEstadoCargas, {
    localKey: 'id',
    foreignKey: 'estadoEstructura'
  })
  public estadoCargaEstructura: BelongsTo<typeof TblEstadoCargas>

  @belongsTo(() => TblEstadoCargas, {
    localKey: 'id',
    foreignKey: 'estadoProceso'
  })
  public estadoCargaProceso: BelongsTo<typeof TblEstadoCargas>


}
