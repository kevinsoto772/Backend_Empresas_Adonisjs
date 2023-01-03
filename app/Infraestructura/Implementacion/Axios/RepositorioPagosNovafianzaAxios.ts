import { RepositorioPagosNovafianza } from "App/Dominio/Repositorios/RepositorioPagosNovafianza";
import axios from "axios";
import Env from "@ioc:Adonis/Core/Env"
import { RespuestaDeudaNovafianza } from "App/Infraestructura/Dto/RespuestaDeudaNovafianza";

export class RepositorioPagosNovafianzaAxios implements RepositorioPagosNovafianza{

    private readonly HOST = Env.get('URL_PAGOS_NOVAFIANZA')

    public async consultarDeuda(tipoDocumento: string, documento: string): Promise<number> {
        const endpoint = `/sw_novafianza/WebApiClientesFia/api/CarteraClienteConsultar/GetCliente?pTipoIdCliente=${tipoDocumento}&pIdCliente=${documento}`
        const respuestaAxios = await axios.get<RespuestaDeudaNovafianza>(`${this.HOST}${endpoint}`)
        return respuestaAxios.data.RespuestaMetodo.IdRetorno
    }
    
}