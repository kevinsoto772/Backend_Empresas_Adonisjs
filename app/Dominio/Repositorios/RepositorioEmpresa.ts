/* eslint-disable @typescript-eslint/semi */
import { Empresa } from '../Datos/Entidades/Empresa';

export interface RepositorioEmpresa {
  obtenerEmpresas(param: any): Promise<Empresa[]>
  obtenerEmpresaPorId(id: Number): Promise<Empresa>
  guardarEmpresa(empresa: Empresa): Promise<void>
  actualizarEmpresa(id: number, empresa: Empresa): Promise<number>
}

