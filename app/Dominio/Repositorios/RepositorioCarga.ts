export interface RepositorioCarga {
  ProcesarArchivo(archivo: any, datos:string): Promise<{}>
}
