import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblUsuariosNovafianzas extends BaseSchema {
  protected tableName = 'tbl_usuarios_novafianzas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('usn_id').unique()
      table.string('usn_nombre',200).notNullable()
      table.string('usn_clave', 255)
      table.boolean('usn_estado').defaultTo(true)
      table.timestamp('usn_creacion', { useTz: true })
      table.timestamp('usn_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
