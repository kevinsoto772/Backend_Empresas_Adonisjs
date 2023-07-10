/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { DateTime } from "luxon";

export class Archivo{
  id: string;
  nombre: string;
  tipo: string;
  prefijo: string;
  prefijoArchivo: string;
  prefijoParametrizacion?: string;
  estado: boolean;
  descripcion?:string;
  formatoId:string;
  updatedAt?:DateTime;
  createdAt?:DateTime;
}
