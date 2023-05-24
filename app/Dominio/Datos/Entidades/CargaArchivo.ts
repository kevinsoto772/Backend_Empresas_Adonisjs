import { DateTime } from 'luxon'

export class CargaArchivo{
  id: string;
  nombre: string;
  fechaInicial: DateTime;
  fechaFinal: DateTime;
  usuario: string;
  tipoArchivo: string;
  estadoProceso: number;
  estadoEstructura: number;
  registrosEncontrados?: number;
  registrosFallidos?: number;
  registrosInsertados?: number;
  estado?: boolean;
  empresa?:string;
  registrosFallidosSafix?: number
  registrosAprobadosSafix?: number
  automatico:boolean
}
