import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblUsuariosNovafianzas extends BaseSchema {
  protected tableName = 'tbl_usuarios_novafianzas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('usn_id').unique()
      table.string('usn_nombre',200).notNullable()
      table.string('usn_clave', 255)
      table.string('usn_apellido', 255)
      table.integer('use_identificacio').unique()
      table.string('usn_clave_temporal', 255)
      table.string('use_usuario', 255)
      table.dateTime('usn_fechaNacimiento')
      table.string('usn_cargo', 255)
      table.string('usn_telefono', 255)
      table.string('usn_correo', 255)
      table.boolean('usn_estado').defaultTo(true)
      table.timestamp('usn_creacion', { useTz: true })
      table.timestamp('usn_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
