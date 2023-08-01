import { Cargo } from "App/Dominio/Datos/Entidades/Cargo";

export class CargoDto{
    public id: string
    public nombre: string
    public estado: boolean

    constructor(cargo:Cargo){
        this.id = cargo.id
        this.nombre = cargo.nombre
        this.estado = cargo.estado
    }
}