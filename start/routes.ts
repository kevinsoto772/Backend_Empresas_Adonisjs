import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EnviadorEmailAdonis } from 'App/Infraestructura/Email/EnviadorEmailAdonis'
import { EmailNotificarCargaArchivo } from 'App/Dominio/Email/Emails/EmailNotificarCargaArchivo'
import { DateTime } from 'luxon'
import { RepositorioAutorizacionDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioAutorizacionDB'

Route.get('/', async ({ response }: HttpContextContract) => {
  response.status(200).send('¡Bienvenido al API de Novafianza!')
})

/* Route.get('/prueba-email', async ({ response }: HttpContextContract) => {
  const enviadorEmail = new EnviadorEmailAdonis()
  enviadorEmail.enviarTemplate({
    asunto: 'Prueba template',
    de: 'jesing482@gmail.com',
    destinatarios: 'jesidpolo04@gmail.com'
  }, new EmailNotificarCargaArchivo({
    fechaCargue: DateTime.now(),
    nombreArchivo: 'Archivo prueba',
    numeroRadicado: '456753',
    tipoArchivo: 'prueba'
  }))
  response.status(200).send({
    mensaje: 'Correo enviado con éxito',
  })
}) */

Route.get('/prueba-roles', async ({ response }: HttpContextContract) => {
  const repositorio = new RepositorioAutorizacionDB()
  const rol = await repositorio.obtenerRolConModulosYPermisos('002')
  return rol
})
