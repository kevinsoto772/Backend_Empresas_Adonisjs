const generarJsonValidaciones = async (errores: string, alertas: string, tipoError: string) => {

    let arrRegistros: any = [];
    arrRegistros['registros'] = errores;

    let arrCategorias: any = [];
    arrCategorias['categorias'] = [
        {
            "nombre": "Registros obligatorios",
            "registros": arrRegistros['registros']
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
            "registros": alertas
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

