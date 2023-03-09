import { ClienteHttp } from '../ClienteHttp';
import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';
import { ExtructuraArchivos } from './Estructura';
import { ValidarDatos } from './ValidarDatos';
import TblArchivosEmpresas from '../../Infraestructura/Datos/Entidad/ArchivoEmpresa';
import { LogErrores } from '../Datos/Entidades/LogErrores';
import TblLogsErrores from '../../Infraestructura/Datos/Entidad/LogErrores';
import TblCargaDatos from '../../Infraestructura/Datos/Entidad/CargaDato';
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";

export class ValidarEstructura {
  validar = async (entidad: string, tipoArchivo: any, archivo: string, entidadId: string, cargaId: string) => {
    let errores: any = [];
    let issues: any[] = [];
    const prefijo = tipoArchivo.prefijo
    let esCorrecta = false;
   

  }

  validarFilas = async (archivoArreglo: [], campos: any, errores: any, issues: any) => {
    const validarDatos = new ValidarDatos()
let i = 0
    for await (const filas of archivoArreglo) {
      if (!filas) break
      i++;
      const fila = (<string>filas).split('|');

      //Validar longitud      
      if (fila.length != campos.length) {
        /* const nombresCampo = campos.map(campo => {
          return campo.NombreCampo;
        }) */
        errores.push({
          "descripcion": 'Los campos del archivo no tienen la estructura correcta',
          "linea": 0,
          "variable": ''
        })
        break;

      }

      for (const key in fila) {
        const columna = campos.find(campo => campo.Posicion == parseInt(key) + 1)
        const { errors, issus } = await validarDatos.datos(fila[key], columna, i)

        errores.push(...errors)
        issues.push(...issus)

      }

    }
    return { errores, issues }

  }

/*   guardarErrores = async (idCarga: string, errores: []) => {
    let datosGuardar: LogErrores = {
      id: uuidv4(),
      error: JSON.stringify(errores),
      idCarga,
      tipo: '1',
      estado: true
    }
    let guardarErr = new TblLogsErrores()
    guardarErr.establecerLogErroresDb(datosGuardar)
    await guardarErr.save()
    return this.actualizarEstadoCarga(idCarga, 3)
  }

  actualizarEstadoCarga = async (id: string, estado: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    cargaEspecifica.actualizarEstadoCargaEstructura(estado)
    await cargaEspecifica.save()
  }
 */

}