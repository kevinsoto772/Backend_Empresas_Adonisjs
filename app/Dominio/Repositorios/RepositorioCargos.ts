import { Cargo } from "../Datos/Entidades/Cargo";
import { Paginador } from "../Paginador";

export interface RepositorioCargos {
    obtenerTodoslosCargos(): Promise<Cargo[]>
    obtenerCargosPaginados(pagina: number, limite: number): Promise<{paginacion: Paginador, cargos: Cargo[]}>
}