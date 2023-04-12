import { RepositorioCargos } from "App/Dominio/Repositorios/RepositorioCargos";

export class ServicioCargo {
    constructor(private repositorio: RepositorioCargos){}

    obtenerCargosPaginados(pagina: number, limite: number){
        return this.repositorio.obtenerCargosPaginados(pagina, limite)
    }

    obtenerTodosLosCargos(){
        return this.repositorio.obtenerTodoslosCargos()
    }
}