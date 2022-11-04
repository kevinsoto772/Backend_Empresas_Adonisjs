import { RepositorioCarga } from '../../Repositorios/RepositorioCarga';
export class ServicioCarga{
  constructor (private repositorio: RepositorioCarga) { }

  async procesarArchivo (archivo: any): Promise<{}> {
    return this.repositorio.ProcesarArchivo(archivo);
  }

 
}
