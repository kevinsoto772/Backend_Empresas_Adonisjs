
import { ServicioCarga } from 'App/Dominio/Datos/Servicios/ServicioCarga'
import { RepositorioCargaDB } from '../../Infraestructura/Implementacion/BaseDatos/RepositorioCargaDB'
export default class ControladorCarga {
  private servicio: ServicioCarga
  constructor () {
    this.servicio = new ServicioCarga(new RepositorioCargaDB())
  }

  public async cargar ({ request }) {
    try {
      const archivo = request.file('archivo')
      return this.servicio.procesarArchivo(archivo)
    } catch (error) {
      return error
    }
  }
}
