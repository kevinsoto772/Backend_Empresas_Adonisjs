import { Paginador } from "App/Dominio/Paginador";
import { v4 as uuidv4 } from 'uuid'
import { RepositorioArchivoEmpresa } from "App/Dominio/Repositorios/RepositorioArchivoEmpresa";
import { ArchivoEmpresa } from '../Entidades/ArchivoEmpresa';
import TblEmpresas from "App/Infraestructura/Datos/Entidad/Empresa";
import { Empresa } from '../Entidades/Empresa';
import { Estructura } from "App/Infraestructura/Implementacion/Servicios/Estructuras";
import { Archivo } from 'App/Dominio/Datos/Entidades/Archivo';
import Tblarchivos from 'App/Infraestructura/Datos/Entidad/Archivo';
import TblArchivosEmpresas from '../../../Infraestructura/Datos/Entidad/ArchivoEmpresa';

export class ServicioArchivoEmpresa{
  constructor (private repositorio: RepositorioArchivoEmpresa) { }

  async obtenerArchivosEmpresas (params: any): Promise<{archivosEmpresas: ArchivoEmpresa[], paginacion: Paginador}> {
    return this.repositorio.obtenerArchivosEmpresas(params);
  }

  async obtenerArchivoEmpresaPorId (id: string): Promise<ArchivoEmpresa>{
    return this.repositorio.obtenerArchivoEmpresaPorId(id);
  }

  async obtenerArchivosPorEmpresa(idEmpresa: string): Promise<ArchivoEmpresa[]>{
    return this.repositorio.obtenerArchivosPorEmpresa(idEmpresa)
  }

  async guardarArchivoEmpresa (archivoEmpresa: ArchivoEmpresa, manual: any): Promise<ArchivoEmpresa>{
    archivoEmpresa.id = uuidv4();
    return this.repositorio.guardarArchivoEmpresa(archivoEmpresa, manual);
  }

  async guardarArchivosEmpresa(idArchivos: string[], idEmpresa: string){
    const archivosExistentes = await this.repositorio.obtenerArchivosPorEmpresa(idEmpresa)
    const idArchivosExistentes = archivosExistentes.map( archivoExistente => archivoExistente.idArchivo )
    const idArchivosAGuardar = idArchivos.filter( idArchivo => idArchivosExistentes.includes(idArchivo) === false )
    const archivosEmpresaAGuardar = idArchivosAGuardar.map( idArchivoAGuardar => {
      return ArchivoEmpresa.crear(idEmpresa, idArchivoAGuardar, true)
    })
    const archivosAEliminar = idArchivosExistentes.filter(idArchivoExistente => idArchivos.includes(idArchivoExistente) === false)
    await this.repositorio.eliminarArchivosEmpresa(idEmpresa, archivosAEliminar)
    return this.repositorio.guardarArchivosEmpresa(archivosEmpresaAGuardar)
  }

  async actualizarArchivoEmpresa (id: string, archivoEmpresa: ArchivoEmpresa, manual: any): Promise<ArchivoEmpresa> {
    return this.repositorio.actualizarArchivoEmpresa(id, archivoEmpresa, manual);
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
    
    if(archivoEmpresa){
      const estructura = new Estructura()
      const estructuraArchivo = await estructura.actualizar(empresa.nit, archivo.prefijo, archivoEmpresa, false)
     
      
      if(!estructuraArchivo ){
          return { estructura: archivoEmpresa.json, estado: 503 }
      }

      return {estructura: estructuraArchivo, estado : 200 }

      
    }else {
      return { estructura:'', estado: 404 }
    }
  }
}
