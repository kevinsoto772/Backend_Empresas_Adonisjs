/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Archivo/ControladorArchivo.ts'

Route.group(() => {
  Route.post('/registro', accion_path + '.guardarArchivo')
  Route.get('/listar/:pagina?/:limite?', accion_path + '.listar')
  Route.get('/:id', accion_path + '.obtenerArchivoPorId')
  Route.patch('/:id', accion_path + '.actualizarArchivo')
  Route.put('/estado/:id', accion_path + '.cambiarEstado')
}).prefix('api/v1/archivo')