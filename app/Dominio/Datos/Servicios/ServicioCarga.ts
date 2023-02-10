/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioCarga } from '../../Repositorios/RepositorioCarga'
export class ServicioCarga{
  constructor (private repositorio: RepositorioCarga) { }

  async procesarArchivo (archivo: any, datos: string): Promise<void> {
    return this.repositorio.procesarArchivo(archivo, datos)
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
