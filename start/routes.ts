import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EnviadorEmailAdonis } from 'App/Infraestructura/Email/EnviadorEmailAdonis'
import TblRoles from 'App/Infraestructura/Datos/Entidad/Autorizacion/Rol'
import Rol from 'Database/seeders/Rol'
import { Exception } from '@adonisjs/core/build/standalone'
import TblModulos from 'App/Infraestructura/Datos/Entidad/Autorizacion/Modulo'

Route.get('/', async ({response}:HttpContextContract)=>{
  response.status(200).send('¡Bienvenido al API de Novafianza!')
})

Route.get('/prueba-email', async ({response}:HttpContextContract)=>{
  const enviadorEmail = new EnviadorEmailAdonis()
  // eslint-disable-next-line max-len
  enviadorEmail.enviarEmail('Hola mundo!', 'Hola mundo desde vscode gmail - adonis', ['kosotosimanca@gmail.com'])
  response.status(200).send({
    mensaje: 'Correo enviado con éxito',
  })
})

Route.get('/prueba-roles', async ({response}:HttpContextContract)=>{
  const idRol = '74a8173a-b1a6-456a-aa60-54a188b9a530' //administrador
  const rol = await TblRoles.find(idRol)
  let rolDominio = rol?.obtenerRol()
  if(!rol){
    throw new Exception(`No existe el rol ${idRol}`, 404)
  }
  console.log('rol', rol)
  const modulos = await TblModulos.query().join('tbl_roles_modulos', (consulta)=> {
    consulta.on('tbl_modulos.mod_id', '=', 'tbl_roles_modulos.rom_modulo_id')
  }).where('tbl_roles_modulos.rom_rol_id', '=', idRol)
  console.log('modulos', modulos)
  //---------------------------------//
  response.status(200).send(rolDominio)
})
