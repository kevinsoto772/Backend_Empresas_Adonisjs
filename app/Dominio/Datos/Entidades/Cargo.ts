import { DateTime } from "luxon"

export class Cargo{
    private _id: string
    private _nombre: string
    private _estado: boolean
    private _creado: DateTime
    private _actualizado: DateTime

    constructor(id: string, nombre: string, estado: boolean = true, creado?: DateTime, actualizado?: DateTime){
        this._id = id;
        this._nombre = nombre;
        this._estado = estado
        this._creado = creado ?? DateTime.now()
        this._actualizado = actualizado ?? DateTime.now()
    }

    public get id(){
        return this._id
    }

    public get nombre(){
        return this._nombre
    }

    public get estado(){
        return this._estado
    }

    public get creado(){
        return this._creado
    }

    public get actualizado(){
        return this._actualizado
    }
}