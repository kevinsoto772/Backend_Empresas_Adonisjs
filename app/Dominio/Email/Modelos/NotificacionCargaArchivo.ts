import { DateTime } from "luxon"

export interface NotificacionCargaArchivo {
    fechaCargue: string
    nombre:string
    tipoArchivo: string
    nombreArchivo: string
    numeroRadicado: string
    resultado: string
    url:string
    titulo:string
}