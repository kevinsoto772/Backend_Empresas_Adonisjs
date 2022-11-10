/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/ArchivoEmpresa/ControladorArchivoEmpresa.ts'

Route.group(() => {
  Route.post('/registro', accion_path + '.guardarArchivoEmpresa')
  Route.get('/listar/:pagina?/:limite?', accion_path + '.listar')
  Route.get('/:id', accion_path + '.obtenerArchivoEmpresaPorId')
  Route.patch('/:id', accion_path + '.actualizarArchivoEmpresa')
  Route.put('/estado/:id', accion_path + '.cambiarEstado')
}).prefix('api/v1/archivo_empresa')
