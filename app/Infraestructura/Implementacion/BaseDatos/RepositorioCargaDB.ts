import { RepositorioCarga } from 'App/Dominio/Repositorios/RepositorioCarga'

export class RepositorioCargaDB implements RepositorioCarga {

async ProcesarArchivo(archivo: any): Promise<{}> {

  console.log("archivo")

  return archivo;
  
}


 
}
