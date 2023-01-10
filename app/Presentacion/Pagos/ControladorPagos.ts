import { ServicioPagos } from "App/Dominio/Datos/Servicios/ServicioPagos";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { peticionTransaccionValidador } from "./Validadores/PeticionTransaccion";
import { RepositorioMockPagosNovafianzaAxios } from "App/Infraestructura/Implementacion/Servicios/RepositorioMockPagosNovafianza";
import { peticionConsultarDeudaValidador } from "./Validadores/PeticionConsultarDeuda";

export default class ControladorPagos {
    private servicioWompi:ServicioPagos

    public constructor(){
        this.servicioWompi = new ServicioPagos(new RepositorioMockPagosNovafianzaAxios(true))
    }

    public async consultar({request, response}:HttpContextContract){
        const peticion = await request.validate({schema: peticionConsultarDeudaValidador})
        const respuesta = await this.servicioWompi.tieneDeuda(peticion.tipoDocumento, peticion.documento)
        response.status(201).send({
            deuda: respuesta
        })
    }

    public async transaccion({request, response}:HttpContextContract){
        const peticion = await request.validate({schema: peticionTransaccionValidador})
        const respuesta = await this.servicioWompi.generarTransaccion(peticion)
        response.status(201).send(respuesta)
    }
}