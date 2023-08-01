import { Cargo } from "App/Dominio/Datos/Entidades/Cargo";
import { Paginador } from "App/Dominio/Paginador";
import { RepositorioCargos } from "App/Dominio/Repositorios/RepositorioCargos";
import TblCargos from "App/Infraestructura/Datos/Entidad/Cargo";
import { MapeadorPaginacionDB } from "./MapeadorPaginacionDB";

export class RepositorioCargosDB implements RepositorioCargos {
    async obtenerTodoslosCargos(): Promise<Cargo[]> {
        const cargosDb = await TblCargos.all()
        return cargosDb.map( cargoDb => cargoDb.obtenerCargo())
    }
    
    async obtenerCargosPaginados(pagina: number, limite: number): Promise<{ paginacion: Paginador; cargos: Cargo[]; }> {
        const paginacionDb = await TblCargos.query().paginate(pagina, limite)
        const paginacion = MapeadorPaginacionDB.obtenerPaginacion(paginacionDb)
        const cargos = paginacionDb.all().map( cargoDb => cargoDb.obtenerCargo() )
        return {paginacion, cargos}
    }
}