import Route from '@ioc:Adonis/Core/Route'
const controlador = '../../../app/Presentacion/Autenticacion/ControladorAutenticacion.ts'

Route.group(() => {
  Route.post('/inicio-sesion/novafianza', controlador+'.inicioSesionNovafianza')
  Route.post('/inicio-sesion/empresa', controlador+'.inicioSesionEmpresa')
}).prefix('/api/v1/autenticacion')
