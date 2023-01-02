/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { Exception } from '@adonisjs/core/build/standalone'
import { Rol } from 'App/Dominio/Datos/Entidades/Autenticacion/Rol'
import { RepositorioRol } from 'App/Dominio/Repositorios/RepositorioRol'
import TblModulos from 'App/Infraestructura/Datos/Entidad/Autorizacion/Modulo'
import TblRoles from 'App/Infraestructura/Datos/Entidad/Autorizacion/Rol'

export class RepositorioRolDB implements RepositorioRol {
  async obtenerRolporID (idRol: string): Promise<Rol> {
    const rolDB = await TblRoles.findOrFail(idRol)
    let rol = rolDB?.obtenerRol()
    if(!rolDB){
      throw new Exception(`No existe el rol ${idRol}`, 404)
    }
    console.log('rol', rolDB)
    const modulos = await TblModulos.query().join('tbl_roles_modulos', (consulta)=> {
      consulta.on('tbl_modulos.mod_id', '=', 'tbl_roles_modulos.rom_modulo_id')
    }).where('tbl_roles_modulos.rom_rol_id', '=', idRol)
    console.log('modulos', modulos)
    modulos.forEach((modulo) => {
      rol.agregarModulo(modulo.obtenerModulo())
    })
    return rol
  }
}
