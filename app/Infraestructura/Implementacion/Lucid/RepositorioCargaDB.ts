/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ConstructorPeticionTransaccionWompi } from 'App/Dominio/Constructores/ConstructorPeticionTransaccionWompi';
import { RepositorioCarga } from 'App/Dominio/Repositorios/RepositorioCarga'
/* import { validador } from '../../Utils/ValidadorArchivo' */
import axios from 'axios';
const fs = require('fs')
export class RepositorioCargaDB implements RepositorioCarga {
  async ProcesarArchivo (archivo: any, datos: string): Promise<{}> {

    await archivo.moveToDisk('./',{name:archivo.clientName});  
    const path = `./uploads/${archivo.clientName}`;
    const archivoBase64 = fs.readFileSync(path, {encoding: "base64"});
    fs.unlinkSync(path);

    const datosArchivo = JSON.parse(datos);    

    try {

      const data = {
        "pEntidad": datosArchivo.entidad,
        "pConvenio": datosArchivo.convenio,
        "pFechaInicio": datosArchivo.fechaInicio,
        "pFechaFin": datosArchivo.fechaFin,
        "pTipoProceso": datosArchivo.tipoProceso,
        "pRutaArchivo": "",
        "pArchivoBase64": archivoBase64
      }
      const headers = {
        'Content-Type': 'application/json'
      }      
      const respuesta = await axios.post("http://150.136.199.200/sw_novafianza/WebApiCertificacionFia/api/ValidarArchivo/ValidarCargarArchivo", data, {headers})
      const archivoRecibido = Buffer.from(respuesta.data.ArchivoLog, "base64")

      this.FormatearRespuesta(archivoRecibido.toString())
      

      //return archivoRecibido

    } catch (error) {
      console.log;
      
    }



    
    
    return "Fallo"

   

  /*   return validador(path) */
  }

  FormatearRespuesta = (archivo:string) => {
    const re = /: :/gi;
    const formateoArchivo = archivo.replace(re, '&&')

    const filas = formateoArchivo.split('\n')
    console.log(filas[0]);



   // const formateoDos = archivo?.replace(']"","note', ']","note')

  }
}
