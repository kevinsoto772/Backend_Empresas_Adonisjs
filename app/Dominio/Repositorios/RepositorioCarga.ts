export interface RepositorioCarga {
  ProcesarArchivo(archivo: any, usuario:string): Promise<{}>
}
