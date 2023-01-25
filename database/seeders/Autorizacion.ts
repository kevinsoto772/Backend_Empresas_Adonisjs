import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from "uuid"
import TblFuncionalidades from 'App/Infraestructura/Datos/Entidad/Autorizacion/Funcionalidad'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
    public async run() {
        
    }

    private async asignarModulosARoles(){
        /* Database
            .table('tbl_')
            .multiInsert([
                {
                    rom_id: uuid(),
                    rom_rol_id: ,
                    email: 'virk@adonisjs.com',
                    password: await Hash.make('secret'),
                },
                {
                    username: 'romain',
                    email: 'romain@adonisjs.com',
                    password: await Hash.make('secret'),
                }
            ]) */
    }
}
