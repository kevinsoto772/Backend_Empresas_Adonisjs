/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioCarga } from '../../Repositorios/RepositorioCarga'
export class ServicioCarga{
  constructor (private repositorio: RepositorioCarga) { }

  async procesarArchivo (archivo: any, usuario: string): Promise<{}> {
    return this.repositorio.ProcesarArchivo(archivo, usuario)
  }
}
