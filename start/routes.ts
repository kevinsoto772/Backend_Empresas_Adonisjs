import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EnviadorEmailAdonis } from 'App/Infraestructura/Email/EnviadorEmailAdonis'

Route.get('/', async ({response}:HttpContextContract)=>{
    response.status(200).send('¡Bienvenido al API de Novafianza!')
})

Route.get('/prueba-email', async ({response}:HttpContextContract)=>{
    const enviadorEmail = new EnviadorEmailAdonis()
    enviadorEmail.enviarEmail('Hola mundo!', 'Hola mundo desde smtp gmail - adonis', ['jesdady482@gmail.com'])
    response.status(200).send({
        mensaje: 'Correo enviado con éxito'
    })
})
