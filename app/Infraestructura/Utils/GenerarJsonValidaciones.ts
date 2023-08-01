const generarJsonValidaciones = async (errores: string, alertas: string, tipoError: string) => {

    let arrRegistros: any = [];
    arrRegistros['registros'] = errores;

    let arrRegistrosAlertas: any = [];
    arrRegistrosAlertas['registros'] = alertas;

    let arrCategorias: any = [];
    arrCategorias['categorias'] = [
        {
            "nombre": "Registros obligatorios",
            "registros": arrRegistros['registros']
        }
    ];

    let arrCategoriasAlertas: any = [];
    arrCategoriasAlertas['categorias'] = [
        {
            "nombre": "Registros obligatorios",
            "registros": arrRegistrosAlertas['registros']
        }
    ];

    let arrNovedades: any = [];
    arrNovedades['novedades'] = [
        {
            "nombre": "Errores",
            "categorias": arrCategorias['categorias']
        },
        {
            "nombre": "Alertas",
            "categorias": arrCategoriasAlertas['categorias']
        }
    ];

    let arrValidaciones: any = [];
    const nombre = (tipoError === '1') ? "Validacion de estructura" : "Validacion de datos"
    if (tipoError)
        arrValidaciones['validaciones'] = [
            {
                "nombre": nombre,
                "novedades": arrNovedades['novedades']
            }

        ]

    return arrValidaciones
}
export { generarJsonValidaciones }

