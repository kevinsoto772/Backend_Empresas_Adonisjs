import { ClienteHttp } from "App/Dominio/HttpClient";
import Env from "@ioc:Adonis/Core/Env"
import { RespuestaWompiObtenerTokenAceptacion } from "App/Dominio/Dto/Wompi/RespuestaWompiObtenerTokenAceptacion";
import { RespuestaWompiTransaccion } from "App/Dominio/Dto/Wompi/RespuestaWompiTransaccion";
import { ConstructorPeticionTransaccionWompi } from "App/Dominio/Constructores/ConstructorPeticionTransaccionWompi";
import { v4 as uuidv4 } from 'uuid';

export class ServicioWompi {
    private readonly URL = Env.get("URL_WOMPI")
    private readonly KEY_PUBLICA = Env.get("KEY_PUBLICA_WOMPI")

    public constructor(private http:ClienteHttp){}

    public async obtenerTokenAceptacion():Promise<string>{
        const endpoint = `/v1/merchants/${this.KEY_PUBLICA}`
        const respuesta = await this.http.get<RespuestaWompiObtenerTokenAceptacion>(`${this.URL}${endpoint}`)
        return respuesta.data.presigned_acceptance.acceptance_token
    }

    public async generarTransaccion(datos:any, tokenAceptacion:string){
        const endpoint = `/v1/transactions`
        const cabeceras = {
            Authorization: `Bearer ${tokenAceptacion}`
        }
        const constructor = new ConstructorPeticionTransaccionWompi()
        constructor
            .token(tokenAceptacion)
            .valor(datos.valor)
            .email(datos.email)
            .referencia(uuidv4())
            .informacionCliente({
                documento: datos.documento,
                tipoDocumento: datos.tipoDocumento,
                telefono: datos.telefono,
            })
            .metodoPago({
                descripcionPago: "Pago a novafianza",
                tipo: "BANCOLOMBIA_TRANSFER",
                tipoUsuario: "PERSON",
                estadoSandbox: "APPROVED",
            })
        const respuesta = await this.http.post<RespuestaWompiTransaccion>(`${this.URL}${endpoint}`, constructor.construir(), cabeceras)
    }
}