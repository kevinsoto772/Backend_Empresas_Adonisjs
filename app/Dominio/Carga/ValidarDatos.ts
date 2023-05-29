import { ColumnaArchivo } from '../Dto/ColumnaArchivo';
import moment from 'moment';
export class ValidarDatos {

  datos = async (columna: string, campo: any, linea: number) => {
    let errors: any[] = []
    let issus: any[] = []

    switch (campo.TipoDato) {
      case "String":
        this.validarString(columna, campo, errors, issus, linea)
        break;

      case "Number":

        this.validarNumber(columna, campo, errors, issus, linea)
        break;

      case "Date":

        this.validarDate(columna, campo, errors, issus, linea)
        break;

    }    

    return { errors, issus }
  }

  validarString = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[], linea:number) => {
    //TODO: VALIDAR MAX-MIN length
    if (item.length == 0 && campo.Obligatorio == 'S') {
      const error = {
        'descripcion': "El campo no puede ser vacío",
        'datoOriginal': item,
        'variable': campo.NombreCampo,
        "linea": linea,
        

      }
      errors.push(error);

    }
    //TODO: INVERTIR SIGNO < POR >
    if (item.length == 0 && campo.Obligatorio == 'N') {
      const alerta = {
        'descripcion': "El campo se encuentra vacío",
        'datoOriginal': item,
        'variable': campo.NombreCampo,
        "linea": linea,
      }

      issus.push(alerta);
    }


  }

  isNumber = (n: string | number): boolean =>
    !isNaN(parseFloat(String(n))) && isFinite(Number(n));

  validarNumber = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[], linea:number) => {


    if (!this.isNumber(item)) {
      if (campo.Obligatorio == 'S') {

        const error = {
          'descripcion': "El campo no es un número o está vacío",
          'datoOriginal': item,
          'variable': campo.NombreCampo,
          "linea": linea,

        }
        errors.push(error);

      }
      if (campo.Obligatorio == 'N') {        
        const alerta = {
          'descripcion': "El campo no es un número o está vacío",
          'datoOriginal': item,
          'variable': campo.NombreCampo,
          "linea": linea,

        }

        issus.push(alerta);

      }

    }


  }

  validarDate = (item: string, campo: ColumnaArchivo, errors: any[], issus: any[], linea:number) => {
    const formats = [campo.FormatoFecha];
    
    const dateMomentIsValid = moment(item, formats, true).isValid();
    
    if (!dateMomentIsValid) {
      console.log({item, formats, dateMomentIsValid});
      
      if (campo.Obligatorio == 'S') {
        const error = {
          'descripcion': `El dato debe ser una fecha o el formato no corresponde, ${campo.FormatoFecha}`,
          'datoOriginal': item,
          'formatosPermitidos': campo.FormatoFecha,
          'variable': campo.NombreCampo,
          "linea": linea,

        }
        errors.push(error);

      }

      if (campo.Obligatorio == 'N') {

        const alerta = {
          'descripcion': `El dato debe ser una fecha o el formato no corresponde, ${campo.FormatoFecha}`,
          'datoOriginal': item,
          'formatosPermitidos': campo.FormatoFecha,
          'variable': campo.NombreCampo,
          "linea": linea,
        }
        issus.push(alerta);

      }
    }

  }
}


