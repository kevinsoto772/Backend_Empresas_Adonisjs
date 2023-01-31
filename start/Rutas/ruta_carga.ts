import Route from '@ioc:Adonis/Core/Route'
const controlador = '../../../app/Presentacion/Carga/ControladorCarga'

Route.group(() => {
  Route.post('/', controlador+'.cargar')
}).prefix('/api/v1/cargas')
