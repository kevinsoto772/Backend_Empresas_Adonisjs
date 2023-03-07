import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env";

export class Estructura {
  renderizar = async () => {
    const { ArchivoEmpresa } = await import('App/Dominio/Datos/Entidades/ArchivoEmpresa');
    const { TblArchivosEmpresas } = await import('App/Infraestructura/Datos/Entidad/ArchivoEmpresa')
    const  TblEmpresas  = (await import('App/Infraestructura/Datos/Entidad/Empresa')).default
    const  TblArchivos  = (await import('App/Infraestructura/Datos/Entidad/Archivo')).default
    const archivosEmpresas: Array<InstanceType<typeof ArchivoEmpresa>> = await TblArchivosEmpresas.query()

    if (archivosEmpresas.length >= 1) {
      archivosEmpresas.forEach(async (archivoEmpresa: InstanceType<typeof ArchivoEmpresa>) => {

        const empresa = await TblEmpresas.query().where('emp_id', archivoEmpresa.idEmpresa).first()
        const archivo = await TblArchivos.query().where('arc_id', archivoEmpresa.idArchivo).first()
        if (empresa && archivo) {
          const data = {
            "pEntidad": empresa.nit,
            "pTipoProceso": archivo.prefijo
          }
          try {

           await axios.post(Env.get("URL_SERVICIOS") + `ConsultarParametrizacionEntidad/ConsultarParamEntidad`, data).then(async estructura =>{
            if(estructura.data && estructura.data.Campos.length >= 1){
              archivoEmpresa.json = estructura.data


              const updateArchivoempresa = await TblArchivosEmpresas.findOrFail(archivoEmpresa.id)
              updateArchivoempresa.establecerArchivoEmpresaConId(archivoEmpresa)
              updateArchivoempresa.save()
            }
           
            
           })
           
    
        } catch (error) {
            console.log(error);
        }


        }


      })
    }



  }
}