export class ValidarDatos {

  datos = (columna: string, campo: any, ): boolean => {
    let errors: any[] = []
let estado:boolean = false;
    switch (campo.TipoDato) {
      case "String":
       // console.log({columna, campo});
        
         estado = this.validarString(columna, errors)
        break;

      case "Number":
        
        estado = this.validarNumber(columna, errors)
        break;

    }

    return estado
  }  

  validarString = (columna: string, errors: any[]): boolean =>{
    const info: string = columna;

        //TODO '' NULL 
        if (info.length == 0) {
          errores.push({
            "descripcion": descripcion[1],
            "linea": nFila,
            "variable": ""
          })
          
        } else if (info.length == 0 && !var_obligatorio_excel) {
            valueInsert = '';
        }
        return valueInsert;
    
  }
  
  
  validarNumber =(columna: string, errors: any[]): boolean =>{
    
    
  }

}


