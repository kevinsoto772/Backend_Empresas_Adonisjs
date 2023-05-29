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
import { EnviadorEmail } from 'App/Dominio/Email/EnviadorEmail';
import { EmailNotificarCargaArchivo } from 'App/Dominio/Email/Emails/EmailNotificarCargaArchivo';
import { DateTime } from 'luxon';
import { EnviadorEmailAdonis } from '../../Email/EnviadorEmailAdonis';
import { generarExcelValidaciones } from 'App/Infraestructura/Utils/GenerarExcelValidaciones';
import { MapeadorFicheroAdonis } from 'App/Presentacion/Mapeadores/MapeadorFicheroAdonis';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { Estructura } from '../Servicios/Estructuras';
const fs = require('fs')
export class RepositorioCargaDB implements RepositorioCarga {
  private servicioUsuario = new ServicioUsuario(new RepositorioUsuarioNovafianzaDB(), new RepositorioUsuarioEmpresaDB())
  private enviadorEmail: EnviadorEmail
  private enviadorEmail2: EnviadorEmail
  async procesarArchivo(archivo: MultipartFileContract, datos: string): Promise<void> {
    const { usuario, idEmpresa, ...datosCarga } = JSON.parse(datos);
    const automatico = (datosCarga.automatico == "S") ? true : false

    // llamar a la funcion para guardar el estado de la carga
    const idDatosGuardados = await this.guardarCarga(datos, archivo.clientName, automatico);

    this.inicioValidaciones(idDatosGuardados, datosCarga, usuario, archivo, datos, idEmpresa, automatico);

  }

  inicioValidaciones = async (idDatosGuardados, datosCarga, usuario, archivo, datos, idEmpresa, automatico: boolean) => {
    let errores: any = [];
    let issues: any[] = [];

    // const archivoBd = await Tblarchivos.findBy('arc_id', datosCarga.tipoArchivo)
    const tipoArchivo = await Tblarchivos.query().preload('tipoArchivo').preload('formato').where('arc_id', datosCarga.tipoArchivo).first()

    if (!tipoArchivo) {
      errores.push({
        "descripcion": 'El archivo no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }



    if (tipoArchivo?.formato[0].formato != archivo.extname) {

      errores.push({
        "descripcion": 'El formato de archivo no corresponde',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }
    const usuarioDB: any = await this.servicioUsuario.obtenerUsuario(usuario)

    if (archivo.extname == 'pdf') {
      const entidadUsuario = await TblEmpresas.query().where('emp_id', usuarioDB.idEmpresa).first()

      await archivo.moveToDisk('./', { name: archivo.clientName });
      const path = `./uploads/${archivo.clientName}`;

      const archivoBase64 = fs.readFileSync(path, { encoding: "base64" });


      const data = {
        "pEntidad": entidadUsuario?.nit,
        "pFechaInicio": datosCarga.fechaInicial,
        "pFechaFin": datosCarga.fechaFinal,
        "pNombreArchivo": archivo.clientName,
        "pArchivoBase64": archivoBase64
      }
      this.enviarPdf(data, true, idDatosGuardados);
      return
    }

    const empresa = await TblEmpresas.findBy('emp_id', idEmpresa)
    if (!empresa) {
      errores.push({
        "descripcion": 'El nit de la empresa en el nombre del archivo no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }
    const archivosEmpresa = await TblArchivosEmpresas.query().where({ 'are_archivo_id': tipoArchivo.id, 'are_empresa_id': empresa.id }).first()


    if (!archivosEmpresa) {
      errores.push({
        "descripcion": 'La empresa no tiene asignado este servicio, consulte con el admnistrador',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }

    const estructura = new Estructura()
    const estructuraArchivo = await estructura.actualizar(empresa.nit, tipoArchivo.prefijo, archivosEmpresa, false)

    let estructuraJson = {}
    if (!estructuraArchivo) {
      estructuraJson = (archivosEmpresa.json) ?? {};
      if (Object.keys(estructuraJson).length == 0) {
        errores.push({
          "descripcion": 'No existe una estructura de validacion para este archivo',
          "linea": 0,
          "variable": ''
        })
        this.guardarErrores(idDatosGuardados, errores, '1')
        return
      }
      console.log("Estructura en bd");   

    } else {
      console.log("Actualizo la estructura");    
      console.log(estructuraArchivo);     
    }




    const isValid = this.validarNombre(archivo.clientName, empresa.nit, empresa.convenio, estructuraJson['EstructuraNombreArchivo']);
    if (!isValid) {
      errores.push({
        "descripcion": `La estructura del nombre del archivo no es correcto ( ${estructuraJson['EstructuraNombreArchivo']} )`,
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }


    const campos = estructuraJson['Campos']
    const tipoDeProceso = tipoArchivo.tipoArchivo.map((tipo) => tipo.valor)[0]

    const fichero = await MapeadorFicheroAdonis.obtenerFichero(archivo);

    const validatEstructura = new ValidarEstructura();
    const path = archivo.tmpPath;

    await fs.readFile(path, "utf8", async (err, data) => {
      if (err) {
        console.log('error: ', err);
      } else {
        const archivoArreglo = data.split('\r\n')

        await validatEstructura.validarFilas(archivoArreglo, campos, errores, issues);

        //console.log(errores, issues);

        if (issues.length != 0) {
          this.guardarAlertas(idDatosGuardados, issues, '1')
        }


        if (errores.length != 0) {

          this.guardarErrores(idDatosGuardados, errores, '1', archivoArreglo.length, errores.length)

          this.enviarCorreo('NOVAFIANZA S.A.S - Archivo con novedades', usuarioDB.correo, 'estructura', `${usuarioDB.nombre} ${usuarioDB.apellido}`,
            archivo.clientName, idDatosGuardados, 'Falló', tipoArchivo.nombre, fichero, automatico)

        }
        if (errores.length == 0) {
          console.log(" No hay errores de estructura");

          this.actualizarEstadoEstructura(idDatosGuardados, (issues.length != 0) ? 4 : 2, archivoArreglo.length)
          this.actualizarEstadoCarga(idDatosGuardados, 1);

          this.enviarCorreo('NOVAFIANZA S.A.S - Archivo sin novedades', usuarioDB.correo, 'estructura', `${usuarioDB.nombre} ${usuarioDB.apellido}`,
            archivo.clientName, idDatosGuardados, 'Exitoso', tipoArchivo.nombre, fichero, automatico)


          const archivoBase64 = fs.readFileSync(path, { encoding: "base64" });

          //Validacion de datos
          try {
            let data;
            if (tipoDeProceso == 'WebApiCertificacionFia') {
              data = {
                "pEntidad": empresa.nit,
                "pConvenio": empresa.convenio,
                "pFechaInicio": datosCarga.fechaInicial,
                "pFechaFin": datosCarga.fechaFinal,
                "pAnioLote": datosCarga.anio,
                "pMesLote": datosCarga.mes,
                "pTipoProceso": tipoArchivo.prefijo,
                "pRutaArchivo": "",
                "pArchivoBase64": archivoBase64,
                "pAprobarAutomatico": datosCarga.automatico
              }
            }

            if (tipoDeProceso == 'WebApiReclamacionesFia') {
              data = {
                "pEntidad": empresa.nit,
                "pConvenio": empresa.convenio,
                "pFechaInicio": datosCarga.fechaInicial,
                "pFechaFin": datosCarga.fechaFinal,
                "pFechaCargue": this.format(new Date(), 2),
                "pAnioReclamacion": datosCarga.anio,
                "pMesReclamacion": datosCarga.mes,
                "pTipoProceso": tipoArchivo.prefijo,
                "pRutaArchivo": "",
                "pArchivoBase64": archivoBase64,
                "pAprobarAutomatico": datosCarga.automatico
              }
            }


            const headers = {
              'Content-Type': 'application/json'
            }
            const respuesta = await axios.post(`${Env.get('URL_CARGA')}/${tipoDeProceso}/api/ValidarArchivo/ValidarCargarArchivo`, data, { headers })

            const datosAdicionales = {
              tipoArchivo: tipoArchivo.nombre,
              usuario: `${usuarioDB.nombre} ${usuarioDB.apellido}`,
              nombreArchivo: archivo.clientName,
              correo: usuarioDB.correo
            }

            const envioAutomatico = (datosCarga.automatico == "S") ? true : false;

            this.validarRespuesta(respuesta.data, idDatosGuardados, data, tipoDeProceso, datosAdicionales, archivoArreglo.length, fichero, envioAutomatico);

          } catch (error) {

            errores.push({
              "descripcion": 'Fallo la carga del archivo para la validación de datos, intente mas tarde',
              "linea": 0,
              "variable": ''
            })
            this.guardarErrores(idDatosGuardados, errores, '2', archivoArreglo.length, archivoArreglo.length)
            return

          }
        }
      }
    })
  }

  formatearRespuesta = async (archivo: string, id: string, registros: number) => {
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
              //"descripcion": columnas[i] ?? '',
              "descripcion": columna ?? '',
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
    console.log("Guardar errores dato");


    this.guardarErrores(id, errores, '2', registros, filas.length)



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
          estadoValidacionEstructura: sql.estadoCargaEstructura.nombre,
          tipoCarga: (sql.automatico) ? "Automático" : "Prueba"
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



  guardarCarga = async (datos: string, nombre: string, automatico: boolean): Promise<string> => {
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
      estadoEstructura: 1,
      automatico
    }

    let cargaArchivo = new TblCargaDatos();

    cargaArchivo.establecerCargaArcivoDb(datosGuardar)
    await cargaArchivo.save()

    return datosGuardar.id;

  }

  actualizarEstadoCarga = async (id: string, estado: number, encontrados?: number, fallidos?: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    if (encontrados) {
      cargaEspecifica.actualizarEstadoCargaService(estado, encontrados, fallidos)
    } else {
      cargaEspecifica.actualizarEstadoCargaService(estado)
    }
    await cargaEspecifica.save()
  }
  actualizarEstadoEstructura = async (id: string, estado: number, encontrados?: number, fallidos?: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    cargaEspecifica.actualizarEstadoCargaEstructura(estado, encontrados, fallidos)
    await cargaEspecifica.save()
  }

  validarNombre = (nombreArchivo: string, nit, convenio, estructura): boolean => {
    const arrNombre = nombreArchivo.split('_');
    const entidad = arrNombre[1];
    const convenioA = arrNombre[2];
    const prefijo = arrNombre[0];
    const estructuraNombre = estructura
    const arrNombreE = estructuraNombre.split('_');


    if (entidad == nit && convenioA == convenio && prefijo == arrNombreE[0]) {
      return true;
    }
    return false;

  }

  validarRespuesta = async (respuestaAxio: any, idCarga: string, data: any, tipoDeProceso: string, datosAdicionales: any, registros: number, fichero, automatico: boolean) => {
    const idRetorno = respuestaAxio.RespuestaMetodo.IdRetorno;
    const archivoLog = respuestaAxio.ArchivoLog;


    if (idRetorno === 0) {
      let asunto = '';
      let mensaje = '';
      if (archivoLog === '') {
        console.log("No tiene archivo log");
        asunto = 'NOVAFIANZA S.A.S - Archivo sin novedades'
        mensaje = 'Exitoso'

        if (automatico) {
          this.enviarPdf(data, false, idCarga);
        }
        //Almacenar archivo localmente
        //await fichero.moveToDisk('./', { name: fichero.clientName });
        this.actualizarEstadoCarga(idCarga, 2)
      }


      if (archivoLog !== '') {

        console.log("Tiene archivo log");

        asunto = 'NOVAFIANZA S.A.S - Archivo con novedades'
        mensaje = 'Falló'
        const archivoRecibido = Buffer.from(archivoLog, "base64")
        this.formatearRespuesta(archivoRecibido.toString(), idCarga, registros)
      }
      this.enviarCorreo(asunto, datosAdicionales.correo, 'datos', datosAdicionales.usuario,
        datosAdicionales.nombreArchivo, idCarga, mensaje, datosAdicionales.tipoArchivo, fichero, automatico)


    } else {
      this.enviarCorreo('NOVAFIANZA S.A.S - Archivo con novedades', datosAdicionales.correo, 'datos', datosAdicionales.usuario,
        datosAdicionales.nombreArchivo, idCarga, 'Fallo la validación de los datos, intente cargar el archivo nuevamente', datosAdicionales.tipoArchivo, fichero, automatico)
      return this.actualizarEstadoCarga(idCarga, 3)
    }

  }

  guardarErrores = async (idCarga: string, errores: [], tipo: string, encontrados?: number, fallidos?: number) => {
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
      : this.actualizarEstadoCarga(idCarga, 3, encontrados, fallidos)


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
      if (!archivoCargado) {
        return { mensaje: 'no se encontro el registro de errores' }
      }
      const usuario_id = archivoCargado?.usuario ?? ''

      const usuario = await this.servicioUsuario.obtenerUsuario(usuario_id)
      const logsErr = await TblLogsErrores.query()
        .where('err_carga_datos_id', id)

      let tipo = '1'
      let errores: any = []
      if (logsErr[0]) {
        errores = logsErr[0].error
        tipo = logsErr[0].tipo
      }

      const logsIss = await TblLogsAdvertencias.query()
        .where('adv_carga_datos_id', id)

      let advertencia: any = []
      if (logsIss[0]) {
        advertencia = logsIss[0].advertencia
      }

      const formatearLogs = await generarJsonValidaciones(errores, advertencia, tipo)

      const aprobadosEstructura = archivoCargado.registrosEncontrados - archivoCargado.registrosFallidos

      const aprobadosServicio = archivoCargado.registrosEncontrados - archivoCargado.registrosFallidosSafix

      const logs = {
        "nombreArchivo": archivoCargado?.nombre,
        "cargadoPor": `${usuario.nombre} ${usuario.apellido}`,
        "fechaYHora": archivoCargado.createdAt,
        "fechaCorteFinal": archivoCargado.fechaFinal,
        "fechaCorteInicial": archivoCargado.fechaInicial,
        "totalEstructura": archivoCargado.registrosEncontrados,
        "aprobadosEstructura": aprobadosEstructura,
        "novedadesEstructura": archivoCargado.registrosFallidos,
        "totalSafix": archivoCargado.registrosEncontrados,
        "aprobadosSafix": aprobadosServicio,
        "novedadesSafix": archivoCargado.registrosFallidosSafix,
        "validaciones": formatearLogs.validaciones
      }

      return logs


    } catch (error) {
      console.error(error);

    }


  }

  async obtenerExcel(idArchivoCargado: string) {
    try {
      console.log(idArchivoCargado)
      const logsErr = await TblLogsErrores.query()
        .where('err_carga_datos_id', idArchivoCargado)
      let tipo = '1'
      let errores: any = []
      if (logsErr[0]) {
        errores = logsErr[0].error
        tipo = logsErr[0].tipo
      }
      const logsIss = await TblLogsAdvertencias.query()
        .where('adv_carga_datos_id', idArchivoCargado)

      let advertencia: any = []
      if (logsIss[0]) {
        advertencia = logsIss[0].advertencia
      }
      return generarExcelValidaciones(errores, advertencia, tipo)
    } catch (error) {
      console.error(error);
    }
  }

  async buscarCargados(parametros: string): Promise<any> {
    let archivos = {};

    try {

      const { entidadId, pagina = 1, limite = 5, frase } = JSON.parse(parametros);

      const archivosBd = await TblCargaDatos.query().preload('archivo').preload('estadoCargaEstructura').preload('estadoCargaProceso')
        .where('car_empresa_id', entidadId)
        .whereILike('car_nombre', `%${frase}%`)
        .paginate(pagina, limite)

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

  enviarPdf = async (data: any, esPdf: boolean, idCarga: string) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      await axios.post(`${Env.get('URL_CARGA')}/WebApiCertificacionFia/api/SubirCertificados/SubirCertificados`, data, { headers })
      if (esPdf) {
        this.actualizarEstadoEstructura(idCarga, 2)
      }

    } catch (error) {
      console.log(error);
    }
  }

  enviarCorreo = (asunto: string, destinatarios: string, titulo: string, nombre: string,
    nombreArchivo: string, numeroRadicado: string, resultado: any, tipoArchivo: any, fichero, automatico: boolean) => {

    if (automatico) {
      this.enviadorEmail = new EnviadorEmailAdonis()
      this.enviadorEmail.enviarTemplate({
        asunto,
        de: Env.get('SMTP_USERNAME'),
        destinatarios,
        alias: Env.get('EMAIL_ALIAS')

      }, new EmailNotificarCargaArchivo({
        fechaCargue: this.format(new Date(), 1),
        titulo,
        nombre,
        nombreArchivo,
        numeroRadicado,
        resultado,
        tipoArchivo,
        url: `${Env.get('DOMINIO')}/Front-novafianza/dist/admin`
      }), fichero)
    }
  }

  format(inputDate, tipo: number) {
    let date, month, year, hour, minute, second;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    hour = inputDate.getHours();
    minute = inputDate.getMinutes();
    second = inputDate.getSeconds();

    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    hour = hour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0');
    second = second.toString().padStart(2, '0');

    if (tipo == 1) {
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    }
    return `${year}-${month}-${date}`;
  }

}
