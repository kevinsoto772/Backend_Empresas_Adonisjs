/* eslint-disable @typescript-eslint/naming-convention */
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

const accion_path = '../../../app/Presentacion/Empresa/ControladorEmpresa.ts'

Route.group(() => {
  Route.post('/registro', accion_path + '.guardarEmpresa')
  Route.get('/listar/:pagina?/:limite?', accion_path + '.listar')
  Route.get('/:id', accion_path + '.obtenerEmpresaPorId')
  Route.patch('/:id', accion_path + '.actualizarEmpresa')
  Route.put('/estado/:id', accion_path + '.cambiarEstado')
}).prefix('api/v1/empresa')
