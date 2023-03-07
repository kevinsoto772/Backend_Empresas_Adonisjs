import { ColumnaArchivo } from '../Dto/ColumnaArchivo';
import moment from 'moment';
export class ValidarDatos {

  datos = async (columna: string, campo: any) => {
    let errors: any[] = []
    let issus: any[] = []

    switch (campo.TipoDato) {
      case "String":
        this.validarString(columna, campo, errors, issus)
        break;

      case "Number":

        this.validarNumber(columna, campo, errors, issus)
        break;

      case "Date":

        this.validarDate(columna, campo, errors, issus)
        break;

    }    

    return { errors, issus }
  }

  validarString = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[]) => {
    //TODO: VALIDAR MAX-MIN length
    if (item.length == 0 && campo.Obligatorio == 'S') {
      const error = {
        'error': "El campo no puede ser vacío",
        'datoOriginal': item,
        'variable': campo.NombreCampo

      }
      errors.push(error);

    }
    //TODO: INVERTIR SIGNO < POR >
    if (item.length == 0 && campo.Obligatorio == 'N') {
      const alerta = {
        'alerta': "El campo se encuentra vacío",
        'datoOriginal': item,
        'variable': campo.NombreCampo
      }

      issus.push(alerta);
    }


  }

  isNumber = (n: string | number): boolean =>
    !isNaN(parseFloat(String(n))) && isFinite(Number(n));

  validarNumber = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[]) => {


    if (!this.isNumber(item)) {
      if (campo.Obligatorio == 'S') {

        const error = {
          'error': "El campo no es un número o está vacío",
          'datoOriginal': item,
          'variable': campo.NombreCampo

        }
        errors.push(error);

      }
      if (campo.Obligatorio == 'N') {        
        const alerta = {
          'alerta': "El campo no es un número o está vacío",
          'datoOriginal': item,
          'variable': campo.NombreCampo

        }

        issus.push(alerta);

      }

    }


  }

  validarDate = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[]) => {
    const formats = [campo.FormatoFecha];
    const dateMomentIsValid = moment(item, formats, true).isValid();

    if (!dateMomentIsValid) {
      if (campo.Obligatorio == 'S') {
        const error = {
          'error': "El dato debe ser una fecha",
          'datoOriginal': item,
          'formatosPermitidos': campo.FormatoFecha,
          'variable': campo.NombreCampo

        }
        errors.push(error);

      }

      if (campo.Obligatorio == 'N') {
        const alerta = {
          'error': "El dato debe ser una fecha",
          'datoOriginal': item,
          'formatosPermitidos': campo.FormatoFecha,
          'variable': campo.NombreCampo

        }
        issus.push(alerta);

      }
    }

  }
}


