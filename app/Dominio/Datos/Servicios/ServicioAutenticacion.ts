import { UsuarioEmpresa } from "../Entidades/UsuarioEmpresa";
import { UsuarioNovafianza } from "../Entidades/UsuarioNovafianza";
import { ServicioUsuarioEmpresa } from "./ServicioUsuarioEmpresa";
import { ServicioUsuarioNovafianza } from "./ServicioUsuarioNovafianza";

export class ServicioAutenticacion{
    public constructor(
        private servicioUsuarioEmpresa:ServicioUsuarioEmpresa, 
        private servicioUsuarioNovafianza:ServicioUsuarioNovafianza
    ){}
}