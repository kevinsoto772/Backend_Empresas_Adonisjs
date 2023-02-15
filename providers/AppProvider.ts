import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { IocContract } from '@adonisjs/fold'
import { RepositorioFicheroLocal } from 'App/Infraestructura/Ficheros/RepositorioFicheroLocal'

export default class AppProvider {
  constructor (protected app: ApplicationContract, protected $container: IocContract) {
  }

  public register () {
    this.app.container.bind('App/Dominio/Ficheros/RepositorioFichero', ()=>{
      return new RepositorioFicheroLocal()
    })
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
