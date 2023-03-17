import Excel from 'exceljs'

const cabeceras = [
    { header: "Línea", key: "linea", width: 40 },
    { header: "Descripción error", key: "descripcion", width: 100 },
    { header: "Variable", key: "variable", width: 75 },
    { header: "Tipo", key: "tipo", width: 75 },
    { header: "Categoria", key: "categoria", width: 75 },
    { header: "Alerta", key: "alerta", width: 30 },
    { header: "Error", key: "error", width: 30 },
]

const generarExcelValidaciones = async (errores: any[], alertas: any[], tipoError: string) => {
    console.log(errores)
    console.log(alertas)
    const workbook = new Excel.Workbook();
    const worsheet = workbook.addWorksheet("Postulaciones");
    worsheet.columns = cabeceras;
    let filas:any = []



    let arrRegistrosAlertas: any = [];
    arrRegistrosAlertas['registros'] = alertas;

    console.log('la', arrRegistrosAlertas.length)


    filas = errores.map( registro => {
        return {
            linea: registro.linea,
            descripcion: registro.descripcion,
            variable: registro.variable,
            tipo: tipoError === '1' ? 'Validacion de estructura' : 'Validacion de datos',
            categoria: 'Registros obligatorios',
            alerta: 'No',
            error: 'Sí'
        }
    })

    alertas.forEach( registro => {
        filas.push({
            linea: registro.linea,
            descripcion: registro.alerta,
            variable: registro.variable,
            tipo: tipoError === '1' ? 'Validacion de estructura' : 'Validacion de datos',
            categoria: 'Registros obligatorios',
            alerta: 'Sí',
            error: 'No'
        })
    });
    console.log('filas a agregar', filas.length)
    worsheet.addRows(filas)
    return await workbook.xlsx.writeBuffer() as Buffer;
}
export { generarExcelValidaciones }

