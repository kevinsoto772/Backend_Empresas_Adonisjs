import { v4 as uuid } from 'uuid'

export class ArchivoEmpresa{
  id: string;
  idEmpresa: string;
  idArchivo: string;
  json?:JSON;
  tipo?: string;
  estado: boolean;
  manual?: string;

  public static crear(idEmpresa: string, idArchivo: string, estado: boolean = true, manual?: string, json?:JSON){
    const archivoEmpresa = new ArchivoEmpresa()
    archivoEmpresa.id = uuid()
    archivoEmpresa.idEmpresa = idEmpresa
    archivoEmpresa.idArchivo = idArchivo
    archivoEmpresa.estado = estado
    archivoEmpresa.manual = manual
    archivoEmpresa.json = json
    return archivoEmpresa
  }
}
