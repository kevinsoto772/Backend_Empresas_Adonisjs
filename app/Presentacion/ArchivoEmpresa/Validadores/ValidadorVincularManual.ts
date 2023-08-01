import { schema, rules } from "@ioc:Adonis/Core/Validator"

export const validadorVincularManual = schema.create({
    idArchivo: schema.string({trim: true}),
    idEmpresa: schema.string({trim: true}),
    manual: schema.file()
})