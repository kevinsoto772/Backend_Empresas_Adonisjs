/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioCarga } from 'App/Dominio/Repositorios/RepositorioCarga'
import { validador } from '../../Utils/ValidadorArchivo'
export class RepositorioCargaDB implements RepositorioCarga {
  async ProcesarArchivo (archivo: any, usuario: string): Promise<{}> {
    console.log(usuario)

    await archivo.moveToDisk('./',{name:archivo.clientName})

    const path = `./uploads/${archivo.clientName}`

    return validador(path)
  }
}
