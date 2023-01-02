/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Rol } from '../Datos/Entidades/Autenticacion/Rol'

export class RespuestaInicioSesion {
  id: string
  usuario: string
  token: string
  rol: Rol
  nombre: string
  claveTemporal: boolean

  constructor (id: string, usuario: string, token: string, rol: Rol, nombre: string, claveTemporal: boolean) {
    this.id = id
    this.usuario = usuario
    this.token = token
    this.rol = rol
    this.nombre = nombre
    this.claveTemporal = claveTemporal
  }
}
