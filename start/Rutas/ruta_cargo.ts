import Route from '@ioc:Adonis/Core/Route'
const controlador = '../../../app/Presentacion/Cargo/ControladorCargo'

Route.group(() => {
    Route.get('/', `${controlador}.obtenerTodos`)
}).prefix('/api/v1/cargos').middleware('autenticacionJwt')
