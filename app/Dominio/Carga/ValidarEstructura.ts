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
const fs = require("fs");

export class ValidarEstructura {
  validar = async (entidad: string, tipoArchivo: any, archivo: string, entidadId: string, cargaId: string) => {
    let errores: any = [];
    let issues: any[] = [];
    const prefijo = tipoArchivo.prefijo
    let esCorrecta = false;
    /* try {

      const archivosEmpresa = await TblArchivosEmpresas.query().where({ 'are_archivo_id': tipoArchivo.id, 'are_empresa_id': entidadId }).first()

      if (!archivosEmpresa) {
        errores.push({
          "descripcion": 'El archivo no existe en la base de datos',
          "linea": 0,
          "variable": ''
        })
        this.guardarErrores(cargaId, errores)
        throw new Error("guardar error");
      }

      const estructuraJson = (archivosEmpresa.json) ?? {};
      if (Object.keys(estructuraJson).length == 0) {
        errores.push({
          "descripcion": 'No existe una estructura de validacion para este archivo',
          "linea": 0,
          "variable": ''
        })
        this.guardarErrores(cargaId, errores)
        throw new Error("guardar error");
      }

      const campos = estructuraJson['Campos']

      const archivoTxt = await fs.createReadStream(archivo, "utf8")
      await archivoTxt.on('data', async (chunk) => {

        const archivoArreglo = chunk.split('\r\n')

        await this.validarFilas(archivoArreglo, campos, errores, issues);
        
        if (errores.length != 0) {
          this.guardarErrores(cargaId, errores)
          esCorrecta = false;
          
        }
        if (errores.length == 0) {

          esCorrecta = true;
          console.log(esCorrecta);
          
        }


      });      

      


    } catch (error) {
    }

    return { esCorrecta} */

  }

  validarFilas = async (archivoArreglo: [], campos: any, errores: any, issues: any) => {
    const validarDatos = new ValidarDatos()

    for await (const filas of archivoArreglo) {
      if (!filas) break
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
        const { errors, issus } = await validarDatos.datos(fila[key], columna)

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