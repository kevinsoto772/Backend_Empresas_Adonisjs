
import { ServicioCarga } from 'App/Dominio/Datos/Servicios/ServicioCarga'
import { RepositorioCargaDB } from '../../Infraestructura/Implementacion/BaseDatos/RepositorioCargaDB';
export default class ControladorCarga {
  private servicio: ServicioCarga
  constructor() {
    this.servicio = new ServicioCarga(new RepositorioCargaDB)
   }

  public async cargar({ request, response }) {
    try {
      const archivo = request.file('archivo', {
        extnames: ['txt', 'csv'],
      });
      if (!archivo) {
        return response.status(400).send({mensaje:"No se encontro archivo"}); 
      }
      
      if (!archivo.isValid) {
        return response.status(400).send({mensaje:"Formato incorrecto para el archivo"}); 
      }

      return this.servicio.procesarArchivo(archivo)
    } catch (error) {
      return error
    }


  }


}