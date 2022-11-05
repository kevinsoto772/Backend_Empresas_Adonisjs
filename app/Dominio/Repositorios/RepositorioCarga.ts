export interface RepositorioCarga {
  ProcesarArchivo(archivo: any): Promise<{}>
}
