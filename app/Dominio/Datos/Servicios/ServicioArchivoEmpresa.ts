import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioArchivoEmpresa } from "App/Dominio/Repositorios/RepositorioArchivoEmpresa";
import Env from "@ioc:Adonis/Core/Env";
import { ArchivoEmpresa } from '../Entidades/ArchivoEmpresa';
import TblEmpresas from "App/Infraestructura/Datos/Entidad/Empresa";
import { Empresa } from '../Entidades/Empresa';
import { Estructura } from "App/Infraestructura/Implementacion/Servicios/Estructuras";
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo';
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo';
import TblArchivosEmpresas from '../../../Infraestructura/Datos/Entidad/ArchivoEmpresa';
import { Fichero } from "App/Dominio/Ficheros/Fichero";
import { RepositorioFichero } from "App/Dominio/Ficheros/RepositorioFichero";
import { RUTAS_ARCHIVOS } from "App/Dominio/Ficheros/RutasFicheros";

export class ServicioArchivoEmpresa{
  constructor (private repositorio: RepositorioArchivoEmpresa, private repositorioFicheros: RepositorioFichero) { }

  async obtenerArchivosEmpresas (params: any): Promise<{archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador}> {
    return this.repositorio.obtenerArchivosEmpresas(params);
  }

  async obtenerArchivoEmpresaPorId (id: string): Promise<ArchivoEmpresa>{
    return this.repositorio.obtenerArchivoEmpresaPorId(id);
  }

  async obtenerArchivosPorEmpresa(idEmpresa: string): Promise<ArchivoEmpresa[]>{
    return this.repositorio.obtenerArchivosPorEmpresa(idEmpresa)
  }

  async guardarArchivoEmpresa (archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa>{
    archivoEmpresa.id = uuidv4();
    return this.repositorio.guardarArchivoEmpresa(archivoEmpresa);
  }

  async guardarArchivosEmpresa(idArchivos: string[], idEmpresa: string){
    const archivosExistentes = await this.repositorio.obtenerArchivosPorEmpresa(idEmpresa)
    const idArchivosExistentes = archivosExistentes.map( archivoExistente => archivoExistente.idArchivo )
    const idArchivosAGuardar = idArchivos.filter( idArchivo => idArchivosExistentes.includes(idArchivo) === false )
    const archivosEmpresaAGuardar = idArchivosAGuardar.map( (idArchivoAGuardar) => {
      return ArchivoEmpresa.crear(idEmpresa, idArchivoAGuardar, true)
    })
    const idArchivosADesactivar = idArchivosExistentes.filter(idArchivoExistente => idArchivos.includes(idArchivoExistente) === false)
    const idArchivosAReactivar = archivosExistentes
    .filter(
      archivoExistente => idArchivos.includes(archivoExistente.idArchivo) === true && archivoExistente.estado === false
    ).map(archivoExistente => archivoExistente.idArchivo)
    console.log('archivos a desactivar', idArchivosADesactivar)
    console.log('archivos a reactivar', idArchivosAReactivar)
    await this.repositorio.cambiarEstadoArchivosEmpresa(idEmpresa, idArchivosAReactivar, true)
    await this.repositorio.cambiarEstadoArchivosEmpresa(idEmpresa, idArchivosADesactivar, false)
    return this.repositorio.guardarArchivosEmpresa(archivosEmpresaAGuardar)
  }

  async actualizarArchivoEmpresa (id: string, archivoEmpresa: ArchivoEmpresa): Promise<ArchivoEmpresa> {
    return this.repositorio.actualizarArchivoEmpresa(id, archivoEmpresa);
  }

  async cambiarEstado (id:string):Promise<ArchivoEmpresa>{
    let archivoEmpresa = await this.repositorio.obtenerArchivoEmpresaPorId(id)
    archivoEmpresa.estado = !archivoEmpresa.estado
    return await this.repositorio.actualizarArchivoEmpresa(id, archivoEmpresa);
  }

  async obtenerVariables(idEmpresa: string, idArchivos: string){
    const empresa: Empresa = await TblEmpresas.findOrFail(idEmpresa)
    const archivo: Archivo = await Tblarchivos.findOrFail(idArchivos)
    const archivoEmpresa: any = await TblArchivosEmpresas.query().where({'are_empresa_id':idEmpresa, 'are_archivo_id':idArchivos}).first()
    

      const estructura = new Estructura()
      const estructuraArchivo = await estructura.actualizar(empresa.nit, archivo.prefijo, archivoEmpresa, false)
     
      if(!estructuraArchivo ){
        if(archivoEmpresa){
          return { estructura: archivoEmpresa.json, estado: 200 }

        }else {      
          return { estructura:'', estado: 404 }
        }
        
      }

      return {estructura: estructuraArchivo, estado : 200 }

      
  }

  async guardarManual(manual: Fichero, idEmpresa: string, idArchivo: string){
    let archivoEmpresa = await this.repositorio.obtenerArchivoEmpresa({
      idArchivo: idArchivo,
      idEmpresa: idEmpresa
    })
    if(!archivoEmpresa){
      archivoEmpresa = ArchivoEmpresa.crear(idEmpresa, idArchivo, false)
      archivoEmpresa = await this.repositorio.guardarArchivoEmpresa(archivoEmpresa)
    }
    archivoEmpresa.manual = `${Env.get('HOSTING')}${Env.get('ENDPOINT_FICHEROS')}${RUTAS_ARCHIVOS.MANUALES}/${archivoEmpresa.id}.${manual.extension}`
    this.repositorioFicheros.guardarFichero(manual, RUTAS_ARCHIVOS.MANUALES, `${archivoEmpresa.id}`, manual.extension)
    await this.repositorio.actualizarArchivoEmpresa(archivoEmpresa.id, archivoEmpresa)
  }
}
