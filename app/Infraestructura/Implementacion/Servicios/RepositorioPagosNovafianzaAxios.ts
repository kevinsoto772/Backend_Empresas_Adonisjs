import { RepositorioPagosNovafianza } from "App/Dominio/Repositorios/RepositorioPagosNovafianza";
import Env from "@ioc:Adonis/Core/Env"
import { RespuestaDeudaNovafianza } from "App/Dominio/Dto/RespuestaDeudaNovafianza";
import { ClienteHttp } from "App/Dominio/ClienteHttp";

export class RepositorioPagosNovafianzaHttp implements RepositorioPagosNovafianza{

    constructor(private clienteHttp:ClienteHttp){}

    private readonly HOST = Env.get('URL_PAGOS_NOVAFIANZA')

    public async consultarDeuda(tipoDocumento: string, documento: string): Promise<number> {
        const endpoint = `/sw_novafianza/WebApiClientesFia/api/CarteraClienteConsultar/GetCliente?pTipoIdCliente=${tipoDocumento}&pIdCliente=${documento}`
        const respuesta = await this.clienteHttp.get<RespuestaDeudaNovafianza>(`${this.HOST}${endpoint}`)
        return respuesta.RespuestaMetodo.IdRetorno
    }
    
}