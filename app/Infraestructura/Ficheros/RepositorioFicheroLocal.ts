import { Fichero } from "App/Dominio/Ficheros/Fichero";
import { RepositorioFichero } from "App/Dominio/Ficheros/RepositorioFichero";
import Env from '@ioc:Adonis/Core/Env'
import { readFileSync, statSync, writeFile, rm, rmSync } from "fs";
import Path from 'path'

export class RepositorioFicheroLocal implements RepositorioFichero{
    eliminarFichero(ruta: string): void {
        const RUTA_FICHEROS = Env.get('RUTA_FICHEROS') as string
        rmSync(`${ process.cwd() }${ RUTA_FICHEROS }${ ruta }`)
    }

    async guardarFichero(fichero: Fichero, ruta: string, nombre: string, extension?: string){
        const RUTA_FICHEROS = Env.get('RUTA_FICHEROS') as string
        let rutaCompleta = `${ process.cwd() }${ RUTA_FICHEROS }${ ruta }/${ nombre }`;
        if(extension) rutaCompleta+= `.${extension}`;
        writeFile(rutaCompleta, fichero.contenido, (err)=>{
            if(err) console.log(err);
        })
    }

    obtenerFichero(ruta: string): Fichero {
        const RUTA_FICHEROS = Env.get('RUTA_FICHEROS') as string
        let rutaCompleta = `${ process.cwd() }${ RUTA_FICHEROS }${ ruta }`;
        const ext = Path.extname(rutaCompleta)
        const nombre = Path.parse(rutaCompleta)
        const buffer = readFileSync(rutaCompleta)
        const tamano = statSync(rutaCompleta).size
        return {
            contenido: buffer,
            extension: ext,
            nombre: `${nombre}`,
            tamano: tamano
        }
    }
    
}