import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { Fichero } from 'App/Dominio/Ficheros/Fichero'
import { readFile } from 'fs/promises'

export class MapeadorFicheroAdonis {
    static async obtenerFichero(ficheroAdonis: MultipartFileContract):Promise<Fichero>{
        console.log(ficheroAdonis)
        return {
            contenido: await readFile(`${ficheroAdonis.tmpPath}`),
            nombre: ficheroAdonis.fileName!,
            tamano: ficheroAdonis.size,
            extension: ficheroAdonis.extname 
        }
    }
}