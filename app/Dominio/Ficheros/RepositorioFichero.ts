import { Fichero } from "./Fichero";

export interface RepositorioFichero {
    eliminarFichero(ruta: string): void
    guardarFichero(fichero: Fichero, ruta: string, nombre: string, extension?: string): void
    obtenerFichero(ruta: string): Fichero
}