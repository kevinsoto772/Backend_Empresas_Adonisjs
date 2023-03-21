import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env";
export class Estructura {
  renderizar = async () => {
    const { ArchivoEmpresa } = await import('App/Dominio/Datos/Entidades/ArchivoEmpresa');
    const TblArchivosEmpresas = (await import('App/Infraestructura/Datos/Entidad/ArchivoEmpresa')).default
    const TblEmpresas = (await import('App/Infraestructura/Datos/Entidad/Empresa')).default
    const TblArchivos = (await import('App/Infraestructura/Datos/Entidad/Archivo')).default
    const archivosEmpresas: Array<InstanceType<typeof ArchivoEmpresa>> = await TblArchivosEmpresas.query()

    if (archivosEmpresas.length >= 1) {
      archivosEmpresas.forEach(async (archivoEmpresa: InstanceType<typeof ArchivoEmpresa>) => {

        const empresa = await TblEmpresas.query().where('emp_id', archivoEmpresa.idEmpresa).first()
        const archivo = await TblArchivos.query().where('arc_id', archivoEmpresa.idArchivo).first()
        if (empresa && archivo) {
          const json = await this.actualizar(empresa.nit, archivo.prefijo, archivoEmpresa, true)
          console.log("Estructura");
          console.log(json);

        }


      })
    }

  }

  actualizar = async (nit, prefijo, archivoEmpresa: any, render: boolean): Promise<any> => {
    const TblArchivosEmpresas = (await import('App/Infraestructura/Datos/Entidad/ArchivoEmpresa')).default

    const data = {
      "pEntidad": nit,
      "pTipoProceso": prefijo
    }
    let estructuraDB: any;
    try {
      await axios.post(Env.get("URL_SERVICIOS") + `ConsultarParametrizacionEntidad/ConsultarParamEntidad`, data, { timeout: 3000 }).then(async estructura => {
        if (estructura.data && estructura.data.Campos.length >= 1) {
          archivoEmpresa.json = estructura.data
          const updateArchivoempresa = await TblArchivosEmpresas.findOrFail(archivoEmpresa.id)
          updateArchivoempresa.establecerArchivoEmpresaConId(archivoEmpresa)
          await updateArchivoempresa.save()
          estructuraDB = updateArchivoempresa.json
        }

      }).catch((error) => {
        throw new Error("fallo la endpoit de safix :" + error);

      })
      return estructuraDB;

    } catch (error) {
      console.log(error);
    }
  }
}