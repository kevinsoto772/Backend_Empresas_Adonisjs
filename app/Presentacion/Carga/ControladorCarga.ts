
import { ServicioCarga } from 'App/Dominio/Datos/Servicios/ServicioCarga'
import { RepositorioCargaDB } from '../../Infraestructura/Implementacion/Lucid/RepositorioCargaDB'
export default class ControladorCarga {
  private servicio: ServicioCarga
  constructor () {
    this.servicio = new ServicioCarga(new RepositorioCargaDB())
  }

  public async cargar ({ request, response }) {
    try {
      const formatos:string[] = ['txt', 'csv']
      const  datos  = request.all();
      const archivo = request.file('archivo', {
        extnames: ['txt', 'csv'],
      })
      if (!archivo) {
        return response.status(400).send({mensaje:'No se encontro archivo'})
      }

      if (!archivo.isValid) {
        return response.status(415).send({mensaje:`Formato inválido: no se puede cargar el archivo seleccionado. Inténtalo nuevamnte, los tipos de archivos permitidos son ${formatos}`})
      }

      return response.status(202).send({mensaje:'El archivo se esta procesado, puede consultar el resumen en el historial de carga'})
      this.servicio.procesarArchivo(archivo, JSON.stringify(datos))
    } catch (error) {
      return error
    }
  }
}
