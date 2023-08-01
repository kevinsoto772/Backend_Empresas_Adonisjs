import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { extname } from 'path'
import Drive from '@ioc:Adonis/Core/Drive'
import { EnviadorEmailAdonis } from 'App/Infraestructura/Email/EnviadorEmailAdonis'
import { RepositorioCargaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioCargaDB'
import { RepositorioFicheroLocal } from 'App/Infraestructura/Ficheros/RepositorioFicheroLocal'
import { Fichero } from 'App/Dominio/Ficheros/Fichero'
import { RUTAS_ARCHIVOS } from 'App/Dominio/Ficheros/RutasFicheros'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

Route.get('/', async ({ response }: HttpContextContract) => {
  response.status(200).send('¡Bienvenido al API de Novafianza!')
})

Route.group(()=>{
  Route.get('/smtp', ({request, response}: HttpContextContract)=>{
    const destinatario = request.qs().destinatario
    const emailer = new EnviadorEmailAdonis()
    emailer.enviarEmail('SMTP Health check', 'El SMTP Novafianza está en correcto funcionamiento.', [destinatario])
    response.status(200).send('Revise el correo de destino.')
  })
}).prefix('healthcheck')

Route.get('/excel', async ({request, response}: HttpContextContract) => {
  const idArchivoCargado = request.qs()['idArchivoCargado'] as string
  const repositorio = new RepositorioCargaDB()
  const buffer = await repositorio.obtenerExcel(idArchivoCargado)
  if(!buffer){
    response.status(500).send(undefined)
    return
  }
  const fichero: Fichero = {
    contenido: buffer,
    nombre: 'reporte',
    extension: 'xlsx',
    tamano: buffer.byteLength
  } 
  const repositorioFichero = new RepositorioFicheroLocal()
  await repositorioFichero.guardarFichero(fichero, RUTAS_ARCHIVOS.REPORTES_FICHEROS, 'reporte', 'xlsx')
  const ruta = `${process.cwd()}${Env.get('RUTA_FICHEROS')}${RUTAS_ARCHIVOS.REPORTES_FICHEROS}/reporte.xlsx`
  response.attachment(ruta)
})

Route.get('/recursos/*', async ({request, response}:HttpContextContract) => {
  const ruta = request.param('*').join('/')
  const path = `${ruta}`
  try {
      const { size } = await Drive.getStats(path)
      response.type(extname(path))
      response.header('content-length', size)
      response.stream(await Drive.getStream(path))
  } catch(e){
      console.log(e)
      response.status(404).send(undefined)
  }
})