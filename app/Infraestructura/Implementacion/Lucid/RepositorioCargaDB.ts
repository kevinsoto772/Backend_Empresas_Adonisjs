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
import TblFormatoArchivo from 'App/Infraestructura/Datos/Entidad/FormatoArchivo';
import { extname } from 'path';
const fs = require('fs')
export class RepositorioCargaDB implements RepositorioCarga {
  private servicioUsuario = new ServicioUsuario(new RepositorioUsuarioNovafianzaDB(), new RepositorioUsuarioEmpresaDB())
  private enviadorEmail: EnviadorEmail
  private enviadorEmail2: EnviadorEmail
  async procesarArchivo(archivo: any, datos: string): Promise<void> {
    const { usuario, ...datosCarga } = JSON.parse(datos);

    // llamar a la funcion para guardar el estado de la carga
    const idDatosGuardados = await this.guardarCarga(datos, archivo.clientName);

    this.inicioValidaciones(idDatosGuardados, datosCarga, usuario, archivo, datos);

  }

  inicioValidaciones = async (idDatosGuardados, datosCarga, usuario, archivo, datos) => {
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
    const usuarioDB:any = await this.servicioUsuario.obtenerUsuario(usuario)
    
    if (archivo.extname == 'pdf') {
      const entidadUsuario = await TblEmpresas.query().where('emp_id',usuarioDB.idEmpresa).first()
      
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
      this.enviarPdf(data, false, idDatosGuardados);
      return
    }



    const [entidad, convenio, prefijo] = this.validarNombre(archivo.clientName, tipoArchivo);



    //TODO cargar archivo pdf


    if (!prefijo) {
      errores.push({
        "descripcion": 'El nombre del archivo no es correcto',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }

    const empresa = await TblEmpresas.findBy('emp_nit', entidad)
    if (!empresa) {
      errores.push({
        "descripcion": 'La empresa no existe en la base de datos',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
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
      return
    }

    const estructuraJson = (archivosEmpresa.json) ?? {};
    if (Object.keys(estructuraJson).length == 0) {
      errores.push({
        "descripcion": 'No existe una estructura de validacion para este archivo',
        "linea": 0,
        "variable": ''
      })
      this.guardarErrores(idDatosGuardados, errores, '1')
      return
    }

    const campos = estructuraJson['Campos']


    /*  const archivoTxt = await fs.createReadStream(path, "utf8")
     await archivoTxt.on('data', async (chunk) => { */


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

          this.enviarCorreo('Archivo Rechazado', usuarioDB.correo, 'estructura', `${usuarioDB.nombre} ${usuarioDB.apellido}`,
          archivo.clientName, idDatosGuardados, 'Falló', tipoArchivo.nombre)

        }
        if (errores.length == 0) {
          console.log(" No hay errores de estructura");
          
          this.actualizarEstadoEstructura(idDatosGuardados, (issues.length != 0) ? 4 : 2, archivoArreglo.length)
          this.actualizarEstadoCarga(idDatosGuardados, 1);

          this.enviarCorreo('Archivo procesado correctamente', usuarioDB.correo, 'estructura', `${usuarioDB.nombre} ${usuarioDB.apellido}`,
          archivo.clientName, idDatosGuardados, 'Exitoso', tipoArchivo.nombre)


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
              "pNombreArchivo": archivo.clientName,
              "pArchivoBase64": archivoBase64
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

            console.log({respuesta});
            

            this.validarRespuesta(respuesta.data, idDatosGuardados, data, tipoDeProceso, datosAdicionales, archivoArreglo.length);

          } catch (error) {

            errores.push({
              "descripcion": 'Fallo la carga del archivo para la validación de datos, intente mas tarde',
              "linea": 0,
              "variable": ''
            })
            this.guardarErrores(idDatosGuardados, errores, '2')
            return

          }
        }
      }
    })

    // });
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

  actualizarEstadoCarga = async (id: string, estado: number, encontrados?: number, fallidos?: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)   
    if(encontrados) {
      cargaEspecifica.actualizarEstadoCargaService(estado, encontrados, fallidos)
    }else{
      cargaEspecifica.actualizarEstadoCargaService(estado)
    }
    await cargaEspecifica.save()
  }
  actualizarEstadoEstructura = async (id: string, estado: number, encontrados?: number, fallidos?: number) => {
    let cargaEspecifica = await TblCargaDatos.findOrFail(id)
    cargaEspecifica.actualizarEstadoCargaEstructura(estado, encontrados, fallidos)
    await cargaEspecifica.save()
  }

  validarNombre = (nombreArchivo: string, tipoDeProceso: any): [string, number, boolean] => {
    const arrNombre = nombreArchivo.split('_');
    const entidad = arrNombre[1];
    const convenio = parseInt(arrNombre[2]);
    const prefijo = (tipoDeProceso?.prefijoArchivo !== arrNombre[0]) ? false : true;

    //TODO: validar entidad(empresa)
    return [entidad, convenio, prefijo];
  }

  validarRespuesta = async (respuestaAxio: any, idCarga: string, data: any, tipoDeProceso: string, datosAdicionales: any, registros: number) => {
    const idRetorno = respuestaAxio.RespuestaMetodo.IdRetorno;
    const archivoLog = respuestaAxio.ArchivoLog;

    console.log({archivoLog});


    if (idRetorno === 0) {
      let asunto = '';
      let mensaje = '';
      if (archivoLog === '') {
        console.log("No tiene archivo log");
        asunto = 'Archivo Aprobado'
        mensaje = 'Exitoso'

        this.enviarPdf(data, false, idCarga);

        this.actualizarEstadoCarga(idCarga, 2)
      }

      if (archivoLog !== '') {

        console.log("Tiene archivo log");
        
        asunto = 'Archivo Rechazado'
        mensaje = 'Falló'
        const archivoRecibido = Buffer.from(archivoLog, "base64")
        this.formatearRespuesta(archivoRecibido.toString(), idCarga, registros)
      }
      this.enviarCorreo(asunto, datosAdicionales.correo, 'datos', datosAdicionales.usuario,
      datosAdicionales.nombreArchivo, idCarga, mensaje, datosAdicionales.tipoArchivo)

      
    } else {
      this.enviarCorreo('Validacion de datos', datosAdicionales.correo, 'datos', datosAdicionales.usuario,
      datosAdicionales.nombreArchivo, idCarga, 'Fallo la validación de los datos, intente cargar el archivo nuevamente', datosAdicionales.tipoArchivo)
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
      if(!archivoCargado){
        return {mensaje: 'no se encontro el registro de errores'}
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
        "totalEstructura":archivoCargado.registrosEncontrados,
        "aprobadosEstructura":aprobadosEstructura,
        "novedadesEstructura":archivoCargado.registrosFallidos,
        "totalSafix": archivoCargado.registrosEncontrados,
        "aprobadosSafix":aprobadosServicio,
        "novedadesSafix":archivoCargado.registrosFallidosSafix,
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
    nombreArchivo: string, numeroRadicado: string, resultado:any, tipoArchivo:any) => {
   
    this.enviadorEmail = new EnviadorEmailAdonis()
    this.enviadorEmail.enviarTemplate({
      asunto,
      de: Env.get('SMTP_USERNAME'),
      destinatarios,
      alias: Env.get('EMAIL_ALIAS')

    }, new EmailNotificarCargaArchivo({
      fechaCargue: DateTime.now(),
      titulo,
      nombre,
      nombreArchivo,
      numeroRadicado,
      resultado,
      tipoArchivo,
      url: `${Env.get('DOMINIO')}/Front-novafianza/dist/admin`
    }))
    
  }
}
