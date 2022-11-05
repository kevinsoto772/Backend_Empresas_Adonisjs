/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/VariableTransversal/ControladorVariableTransversal.ts'

Route.group(() => {
  Route.post('/registro', accion_path + '.guardarVariableTransversal')
  Route.get('/listar/:pagina?/:limite?', accion_path + '.listar')
  Route.get('/:id', accion_path + '.obtenerVariableTransversalPorId')
  Route.patch('/:id', accion_path + '.actualizarVariableTransversal')
  Route.put('/estado/:id', accion_path + '.cambiarEstado')
  Route.put('/obligatoria/:id', accion_path + '.cambiarObligatoria')
  Route.put('/maestra/:id', accion_path + '.cambiarMaestra')
}).prefix('api/v1/variable_transversal')