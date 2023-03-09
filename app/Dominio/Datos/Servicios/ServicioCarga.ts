/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioCarga } from '../../Repositorios/RepositorioCarga'
//import Env from '@ioc:Adonis/Core/Env'
//import { EmailNotificarCargaArchivo } from 'App/Dominio/Email/Emails/EmailNotificarCargaArchivo'
//import { NotificacionCargaArchivo } from 'App/Dominio/Email/Modelos/NotificacionCargaArchivo'
export class ServicioCarga{
  constructor (private repositorio: RepositorioCarga) { }

  async procesarArchivo (archivo: any, datos: string): Promise<void> {
    this.repositorio.procesarArchivo(archivo, datos)
  }

  async  archivosCargados (parametros: string): Promise<{}> {
    return this.repositorio.archivosCargados(parametros)
  }

  async  obtenerLogs (parametros: string): Promise<{}> {
    return this.repositorio.obtenerLogs(parametros)
  }

  async  buscarCargados (parametros: string): Promise<{}> {
    return this.repositorio.buscarCargados(parametros)
  }

}
