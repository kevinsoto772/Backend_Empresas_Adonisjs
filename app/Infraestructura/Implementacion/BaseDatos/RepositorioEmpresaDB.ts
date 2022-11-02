/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Empresa } from 'App/Dominio/Datos/Entidades/Empresa'
import { RepositorioEmpresa } from 'App/Dominio/Repositorios/RepositorioEmpresa'
import Tblempresas from 'App/Infraestructura/Datos/Entidad/Empresa'

export class RepositorioEmpresaDB implements RepositorioEmpresa {
  async obtenerEmpresas (params: any): Promise<Empresa[]> {
    const empresas = await Tblempresas.query().paginate(params.page, params.limit)
    return empresas
  }

  async obtenerEmpresaPorId (id: Number): Promise<Empresa> {
    let Empresa: any
    const empresa = await Tblempresas.find(id)
    Empresa = empresa
    return Empresa
  }

  async guardarEmpresa (empresa: Empresa): Promise<any> {
    let empresaDb = new Tblempresas()
    empresaDb.establecerEmpresaDb(empresa)
    await empresaDb.save()
    return empresaDb
  }

  async actualizarEmpresa (id: number, empresa: Empresa): Promise<number> {
    let empresa_retorno = await Tblempresas.findOrFail(id)
    empresa_retorno.establecerEmpresaConId(empresa)
    await empresa_retorno.save()
    return id
  }
}
