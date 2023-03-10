import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioUsuarioEmpresa } from 'App/Dominio/Datos/Servicios/ServicioUsuarioEmpresa'
import { GeneradorContrasena } from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { EncriptadorAdonis } from 'App/Infraestructura/Encriptacion/EncriptadorAdonis'
import { RepositorioUsuarioEmpresaDB } from '../../Infraestructura/Implementacion/Lucid/RepositorioUsuarioEmpresaDB'
import { EnviadorEmailAdonis } from 'App/Infraestructura/Email/EnviadorEmailAdonis'
import { ServicioAutenticacionJWT } from '../../Dominio/Datos/Servicios/ServicioJWT';
import { RepositorioUsuarioNovafianzaDB } from '../../Infraestructura/Implementacion/Lucid/RepositorioUsuarioNovafianzaDB';
import { ServicioUsuario } from '../../Dominio/Datos/Servicios/ServicioUsuario';


export default class ControladorUsuarioEmpresa {
  private service: ServicioUsuarioEmpresa
  private servicioUsuario: ServicioUsuario;
  constructor () {
    this.service = new ServicioUsuarioEmpresa(
      new RepositorioUsuarioEmpresaDB(), 
      new GeneradorContrasena(), 
      new EncriptadorAdonis(),
      new EnviadorEmailAdonis(),
      this.servicioUsuario =  new ServicioUsuario(new RepositorioUsuarioNovafianzaDB(), new RepositorioUsuarioEmpresaDB())
    )
  }

  public async listar ({ params }) {
    const usuariosEmpresa = await this.service.obtenerUsuariosEmpresa(params)
    return usuariosEmpresa
  }

  public async obtenerUsuarioEmpresaPorId ({ params }) {
    const usuarioEmpresa = await this.service.obtenerUsuarioEmpresaPorId(params.id)
    return usuarioEmpresa
  }

  public async obtenerUsuarioEmpresaPorUsuario ({ request }:HttpContextContract) {
    const usuarioEmpresa = await this.service.obtenerUsuarioEmpresaPorUsuario(request.param('usuario'))
    return usuarioEmpresa
  }

  public async actualizarUsuarioEmpresa ({ params, request }) {
    const dataUsuarioEmpresa = request.all()
    const usuarioEmpresa = await this.service.actualizaUsuarioEmpresa(params.id, dataUsuarioEmpresa)
    return usuarioEmpresa
  }

  public async guardarUsuarioEmpresa ({ request }) {
    const dataUsuarioEmpresa = request.all()
    const usuarioEmpresa = await this.service.guardarUsuarioEmpresa(dataUsuarioEmpresa)
    return usuarioEmpresa
  }

  public async cambiarEstado ({request, response}:HttpContextContract){
    try{
      let id = request.param('id')
      await this.service.cambiarEstado(id)
      response.status(200).send('Cambio realizado correctamente')
    } catch (e) {
      response.status(200).send(e)
    }
  }

  public async obtenerUsuariosEmpresaPorIdEmpresa ({ params }) {
    const usuariosEmpresa = await this.service.obtenerUsuariosEmpresaPorIdEmpresa(params)
    return usuariosEmpresa
  }

  public async buscar({ request, response }: HttpContextContract) {
    const datos = request.all();
    let token: any = request.header('Authorization')?.split(' ')[1]
    const {documento} = ServicioAutenticacionJWT.obtenerPayload(token)
    datos['usuario'] = documento
      
    const usuario = await this.servicioUsuario.obtenerUsuario(datos.usuario)
    if(!datos.entidadId && usuario['idEmpresa']) datos.entidadId = usuario['idEmpresa'] 


    if(usuario['idEmpresa'] && datos.entidadId != usuario['idEmpresa']){
      return response.status(400).send({ mensaje: 'No tiene autorizacion para realizar esta consulta' })
    }
    
    const archivos = await this.service.buscar(JSON.stringify(datos))

    if (Object.keys(archivos).length !== 0) {
      response.status(202).send(archivos)
    } else {
      response.status(400).send({ mensaje: 'Se presento un error al consultar los archivos' })
    }
  }


}
