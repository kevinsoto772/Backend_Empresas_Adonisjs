
import { schema } from '@ioc:Adonis/Core/Validator'

export const esquemaActualizarEmpresa = schema.create({
    nit: schema.string.optional(),
    nombre: schema.string.optional(),
    convenio: schema.string.optional(),
    logo: schema.file.optional({extnames: ['png', 'jpg', 'jpeg', 'txt']})
  })