import Route from '@ioc:Adonis/Core/Route'
const controlador = '../../../app/Presentacion/CArga/ControladorCarga.ts'

Route.group(() => {
  Route.post('/', controlador+'.cargar')
}).prefix('/api/v1/cargas')
