import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { ServicioCargo } from "App/Dominio/Datos/Servicios/ServicioCargo";
import { RepositorioCargosDB } from "App/Infraestructura/Implementacion/Lucid/RepositorioCargoDB";
import { CargoDto } from "./Dtos/CargoDto";

export default class ControladorCargo {
    private servicio: ServicioCargo

    public constructor(){
        this.servicio = new ServicioCargo(new RepositorioCargosDB())
    }

    async obtenerTodos({response}: HttpContextContract){
        const cargos = await this.servicio.obtenerTodosLosCargos()
        response.status(200).send( cargos.map( cargo => new CargoDto( cargo ) ) )
    }
}