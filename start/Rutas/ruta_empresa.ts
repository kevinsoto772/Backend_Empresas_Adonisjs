/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../app/presentacion/Empresa/ControladorEmpresa'

Route.group(() => {
  Route.post('/registro', accion_path + '.guardarEmpresa')
  Route.get('listar/:pagina?/:limite?', accion_path + '.listar')
  Route.get('empresa/:id', accion_path + '.obtenerEmpresaPorId')
  Route.patch('empresa/:id', accion_path + '.actualizarEmpresa')
}).prefix('api/v1/empresa')
