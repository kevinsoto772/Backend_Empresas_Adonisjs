
import { ServicioCarga } from 'App/Dominio/Datos/Servicios/ServicioCarga'
import { RepositorioCargaDB } from '../../Infraestructura/Implementacion/Lucid/RepositorioCargaDB'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo';
import { EnviadorEmailAdonis } from '../../Infraestructura/Email/EnviadorEmailAdonis';
import { ClienteHttpAxios } from '../../Infraestructura/ClientesHttp/ClienteHttpAxios';
export default class ControladorCarga {
  private servicio: ServicioCarga
  constructor() {
    this.servicio = new ServicioCarga(new RepositorioCargaDB(), new EnviadorEmailAdonis(), new ClienteHttpAxios())
  }

  public async cargar({ request, response }) {
    try {
      const formatos: string[] = ['txt', 'csv']
      const datos = request.all();
      const archivo = request.file('archivo', {
        extnames: ['txt', 'csv'],
      })
      if (!archivo) {
        return response.status(400).send({ mensaje: 'No se encontro archivo' })
      }

      if (!archivo.isValid) {
        return response.status(415).send({ mensaje: `Formato inválido: no se puede cargar el archivo seleccionado. Inténtalo nuevamnte, los tipos de archivos permitidos son ${formatos}` })
      }
      
      //const arrNombre = archivo.clientName.split('_');
     /*  const tipoDeProceso = await Tblarchivos.find(datos.tipoArchivo)
    if( tipoDeProceso?.prefijoArchivo !== arrNombre[0]){
      return response.status(415).send({ mensaje: `Formato inválido: el tipo de archivo no coincide con el archivo cargado` })
    } */

    

      this.servicio.procesarArchivo(archivo, JSON.stringify(datos))
      return response.status(202).send({ mensaje: 'El archivo se esta procesado, puede consultar el resumen en el historial de carga' })
      
    } catch (error) {
      return error
    }
  }

  public async cargados({ request, response }: HttpContextContract) {
    const archivos = await this.servicio.archivosCargados(JSON.stringify(request.all()))

    if (Object.keys(archivos).length !== 0) {
      response.status(202).send(archivos)
    } else {
      response.status(400).send({ mensaje: 'Se presento un error al consultar los archivos' })
    }
  }

  public async logs({ request, response }: HttpContextContract) {
    const logs = await this.servicio.obtenerLogs(JSON.stringify(request.all()))

    if (Object.keys(logs).length !== 0) {
      response.status(202).send(logs)
    } else {
      response.status(400).send({ mensaje: 'Se presento un error al consultar los logs' })
    }
  }

  public async buscar({ request, response }: HttpContextContract) {
    const archivos = await this.servicio.buscarCargados(JSON.stringify(request.all()))

    if (Object.keys(archivos).length !== 0) {
      response.status(202).send(archivos)
    } else {
      response.status(400).send({ mensaje: 'Se presento un error al consultar los archivos' })
    }
  }

  
}
