/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { RepositorioCarga } from 'App/Dominio/Repositorios/RepositorioCarga'
import Env from "@ioc:Adonis/Core/Env"
import axios from 'axios';
import TblCargaDatos from '../../Datos/Entidad/CargaDato';
import { v4 as uuidv4 } from 'uuid';
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo';
import TblLogsErrores from '../../Datos/Entidad/LogErrores';
import { LogErrores } from '../../../Dominio/Datos/Entidades/LogErrores';
import { generarJsonValidaciones } from 'App/Infraestructura/Utils/GenerarJsonValidaciones';
import { ServicioUsuario } from "App/Dominio/Datos/Servicios/ServicioUsuario";
import { RepositorioUsuarioNovafianzaDB } from './RepositorioUsuarioNovafianzaDB';
import { RepositorioUsuarioEmpresaDB } from './RepositorioUsuarioEmpresaDB';
import { ValidarEstructura } from '../../../Dominio/Carga/ValidarEstructura';
import TblEmpresas from '../../Datos/Entidad/Empresa';
import TblArchivosEmpresas from '../../Datos/Entidad/ArchivoEmpresa';
import TblLogsAdvertencias from '../../Datos/Entidad/LogAdvertencia';
import { LogAdvertencia } from '../../../Dominio/Datos/Entidades/LogAdvertencia';
const fs = require('fs')
export class RepositorioCargaDB implements RepositorioCarga {
  private servicioUsuario = new ServicioUsuario(new RepositorioUsuarioNovafianzaDB(), new RepositorioUsuarioEmpresaDB())

  async procesarArchivo(archivo: any, datos: string): Promise<void> {
    let errores: any = [];
    let issues: any[] = [];
    const { usuario, ...datosCarga } = JSON.parse(datos);

    // llamar a la funcion para guardar el estado de la carga
    const idDatosGuardados = await this.guardarCarga(datos, archivo.clientName);

    const tipoArchivo = await Tblarchivos.query().preload('tipoArchivo').where('arc_id', datosCarga.tipoArchivo).first()
    if (!tipoArchivo) {
      errores.push({
        "descripcion": 'El archivo no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      throw new Error("guardar error");
    }

    const [entidad, convenio] = this.validarNombre(archivo.clientName, tipoArchivo);

    const empresa = await TblEmpresas.findBy('emp_nit', entidad)
    if (!empresa) {
      errores.push({
        "descripcion": 'El archivo no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      throw new Error("guardar error");
    }


    const tipoDeProceso = tipoArchivo.tipoArchivo.map((tipo) => tipo.valor)[0]

    //Carga de archivo
    await archivo.moveToDisk('./', { name: archivo.clientName });
    const path = `./uploads/${archivo.clientName}`;

    //Validar estructura
    const validatEstructura = new ValidarEstructura();
    // const  {esCorrecta}  = await validatEstructura.validar(entidad, tipoArchivo, path, empresa.id, idDatosGuardados)


    const archivosEmpresa = await TblArchivosEmpresas.query().where({ 'are_archivo_id': tipoArchivo.id, 'are_empresa_id': empresa.id }).first()

    if (!archivosEmpresa) {
      errores.push({
        "descripcion": 'El archivo no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      throw new Error("guardar error");
    }

    const estructuraJson = (archivosEmpresa.json) ?? {};
    if (Object.keys(estructuraJson).length == 0) {
      errores.push({
        "descripcion": 'No existe una estructura de validacion para este archivo',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      throw new Error("guardar error");
    }

    const campos = estructuraJson['Campos']

    const archivoTxt = await fs.createReadStream(path, "utf8")
    await archivoTxt.on('data', async (chunk) => {

      const archivoArreglo = chunk.split('\r\n')

      await validatEstructura.validarFilas(archivoArreglo, campos, errores, issues);

      //console.log(errores, issues);

      if (issues.length != 0) {
        this.guardarAlertas(idDatosGuardados, issues, '1')
      }


      if (errores.length != 0) {
        this.guardarErrores(idDatosGuardados, errores, '1')

      }
      if (errores.length == 0) {
        this.actualizarEstadoEstructura(idDatosGuardados, (issues.length != 0)?4:2)          

        const archivoBase64 = fs.readFileSync(path, { encoding: "base64" });

        //Validacion de datos
        try {
          const data = {
            "pEntidad": entidad,
            "pConvenio": convenio,
            "pFechaInicio": datosCarga.fechaInicial,
            "pFechaFin": datosCarga.fechaFinal,
            "pTipoProceso": tipoArchivo.prefijo,
            "pRutaArchivo": "",
            "pArchivoBase64": archivoBase64
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          const respuesta = await axios.post(`${Env.get('URL_CARGA')}/${tipoDeProceso}/api/ValidarArchivo/ValidarCargarArchivo`, data, { headers })


          this.validarRespuesta(respuesta.data, idDatosGuardados, data, tipoDeProceso);

        } catch (error) {
          console.log(error);

        }
      }


    });



    //si pasa la validacion de estructura


  }

  formatearRespuesta = async (archivo: string, id: string) => {
    const re1 = /:  :/gi;
    const re2 = /::/gi;
    const re = /: :/gi;
    let formateoArchivo = archivo.replace(re1, ': :')
    formateoArchivo = formateoArchivo.replace(re2, ': :')
    formateoArchivo = formateoArchivo.replace(re, '&&')

    formateoArchivo = formateoArchivo.replace(/[']/g, "");

    const filas = formateoArchivo.split('\n')


    let errores: any = [];


    for await (const fila of filas) {
      const columnas = fila.split('&&')
      let nFila: string = '';
      let i = 0;
      for await (const columna of columnas) {
        if (columna !== '') {
          if (i == 0) {
            const primerColumna = columna.split('|');
            nFila = primerColumna[0];
            // const descripcion = primerColumna[2].split(':')
            const descripcion = primerColumna[(primerColumna.length - 1)].split(':')
            errores.push({
              "descripcion": descripcion[1],
              "linea": nFila,
              "variable": ""
            })
            i++;
          } else {
            //  console.log(i, columnas[i]);

            //const otrasColumnas = columnas[i].split(',')
            errores.push({
              "descripcion": columnas[i] ?? '',
              "linea": nFila,
              "variable": ''
            })

            /*  console.log({
               "descripcion": otrasColumnas[1]??'',
               "linea": nFila,
               "variable": otrasColumnas[0]??''
             }); */
          }
        }

      }

    }


    this.guardarErrores(id, errores, '2')



  }


  async archivosCargados(parametros: string): Promise<any> {
    let archivos = {};
    try {
      const { entidadId, pagina = 1, limite = 5 } = JSON.parse(parametros);


      const archivosBd = await TblCargaDatos.query().preload('archivo').preload('estadoCargaEstructura').preload('estadoCargaProceso')
        .where('car_empresa_id', entidadId).orderBy('car_creacion', 'desc').paginate(pagina, limite)

      let arrArchivos: any = []
      for (const sql of archivosBd) {
        arrArchivos.push({
          idArchivoCargado: sql.id,
          fechaYHora: sql.createdAt,
          nombreArchivo: sql.nombre,
          nombreTipoArchivo: sql.archivo.nombre,
          estadoValidacion: sql.estadoCargaProceso.nombre,
          estadoValidacionEstructura: sql.estadoCargaEstructura.nombre
        })

      }
      archivos['archivosCargados'] = arrArchivos;
      archivos['paginacion'] = {
        "totalRegistros": archivosBd.getMeta().total,
        "totalPaginas": archivosBd.getMeta().last_page,
        "paginaActual": archivosBd.getMeta().current_page
      };


    } catch (error) {
      //  console.error(error);

    }

    return archivos;
  }



  guardarCarga = async (datos: string, nombre: string): Promise<string> => {
    const obtenerDatos = JSON.parse(datos);

    let empresa = ''
    const usuario = await this.servicioUsuario.obtenerUsuario(obtenerDatos.usuario)
    empresa = (usuario['idEmpresa']) ?? ''

    let datosGuardar = {
      id: uuidv4(),
      nombre,
      fechaInicial: obtenerDatos.fechaInicial,
      fechaFinal: obtenerDatos.fechaFinal,
      usuario: obtenerDatos.usuario,
      tipoArchivo: obtenerDatos.tipoArchivo,
      empresa,
      estadoProceso: 0,
      estadoEstructura: 1
    }

    let cargaArchivo = new TblCargaDatos();

    cargaArchivo.establecerCargaArcivoDb(datosGuardar)
    cargaArchivo.save()

    return datosGuardar.id;

  }

  actualizarEstadoCarga = async (id: string, estado: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    cargaEspecifica.actualizarEstadoCargaService(estado)
    await cargaEspecifica.save()
  }
  actualizarEstadoEstructura = async (id: string, estado: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    cargaEspecifica.actualizarEstadoCargaEstructura(estado)
    await cargaEspecifica.save()
  }

  validarNombre = (nombreArchivo: string, tipoDeProceso: any): [string, number] => {
    const arrNombre = nombreArchivo.split('_');
    const entidad = arrNombre[1];
    const convenio = parseInt(arrNombre[2]);

    //TODO: validar entidad(empresa)
    return [entidad, convenio];
  }

  validarRespuesta = async(respuestaAxio: any, idCarga: string, data:any, tipoDeProceso:string) => {
    const idRetorno = respuestaAxio.RespuestaMetodo.IdRetorno;
    const archivoLog = respuestaAxio.ArchivoLog;
    if (idRetorno === 0) {
      if (archivoLog === '') {
        try {
          const headers = {
            'Content-Type': 'application/json'
          }
          await axios.post(`${Env.get('URL_CARGA')}/${tipoDeProceso}/api/SubirCertificados/SubirCertificados`, data, { headers })
          
        } catch (error) {
          console.log(error);          
        }

        return this.actualizarEstadoCarga(idCarga, 2)
      } else if (archivoLog !== '') {
        const archivoRecibido = Buffer.from(archivoLog, "base64")
        this.formatearRespuesta(archivoRecibido.toString(), idCarga)
      }
    } else {
      return this.actualizarEstadoCarga(idCarga, 3)
    }

  }

  guardarErrores = async (idCarga: string, errores: [], tipo: string) => {
    let datosGuardar: LogErrores = {
      id: uuidv4(),
      error: JSON.stringify(errores),
      idCarga,
      tipo: tipo,
      estado: true
    }
    let guardarErr = new TblLogsErrores()
    guardarErr.establecerLogErroresDb(datosGuardar)
    await guardarErr.save()
    const actualizar = (tipo == '1')
      ? this.actualizarEstadoEstructura(idCarga, 3)
      : this.actualizarEstadoCarga(idCarga, 3)

    return actualizar
  }

  guardarAlertas = async (idCarga: string, alertas: any, tipo: string) => {
    let datosGuardar: LogAdvertencia = {
      id: uuidv4(),
      advertencia: JSON.stringify(alertas),
      idCarga,
      almacenado: false,
      estado: true

    }
    let guardarIss = new TblLogsAdvertencias()
    guardarIss.establecerLogAdvertenciaDb(datosGuardar)
    await guardarIss.save()
  }


  async obtenerLogs(parametros: string): Promise<any> {
    try {
      const { id } = JSON.parse(parametros);

      const archivoCargado = await TblCargaDatos.findBy('car_id', id)
      const usuario_id = archivoCargado?.usuario ?? ''

      const usuario = await this.servicioUsuario.obtenerUsuario(usuario_id)
      const logsErr = await TblLogsErrores.query()
        .where('err_carga_datos_id', id)

      const logsIss = await TblLogsAdvertencias.query()
        .where('adv_carga_datos_id', id)
        console.log(logsIss);
        
let advertencia:any = []
        if (logsIss[0]) {
          advertencia = logsIss[0].advertencia
        }

      const formatearLogs = await generarJsonValidaciones(logsErr[0].error, advertencia, logsErr[0].tipo)

      const logs = {
        "nombreArchivo": archivoCargado?.nombre,
        "cargadoPor": `${usuario.nombre} ${usuario.apellido}`,
        "fechaYHora": archivoCargado?.createdAt,
        "fechaCorteFinal": archivoCargado?.fechaFinal,
        "fechaCorteInicial": archivoCargado?.fechaInicial,
        "validaciones": formatearLogs.validaciones
      }

      return logs


    } catch (error) {
      console.error(error);

    }


  }

  async buscarCargados(parametros: string): Promise<any> {
    let archivos = {};
    try {

      const { usuario, pagina = 1, limite = 5, frase } = JSON.parse(parametros);


      const archivosBd = await TblCargaDatos.query().preload('archivo').preload('estadoCargaEstructura').preload('estadoCargaProceso')
        .where('car_usuario_id', usuario).whereILike('car_nombre', `%${frase}%`).paginate(pagina, limite)

      let arrArchivos: any = []
      for (const sql of archivosBd) {
        arrArchivos.push({
          idArchivoCargado: sql.id,
          fechaYHora: sql.createdAt,
          nombreArchivo: sql.nombre,
          nombreTipoArchivo: sql.archivo.nombre,
          estadoValidacion: sql.estadoCargaProceso.nombre
        })

      }
      archivos['archivosCargados'] = arrArchivos;
      archivos['paginacion'] = {
        "totalRegistros": archivosBd.getMeta().total,
        "totalPaginas": archivosBd.getMeta().last_page,
        "paginaActual": archivosBd.getMeta().current_page
      };


    } catch (error) {
      console.error(error);

    }

    return archivos;
  }
}
