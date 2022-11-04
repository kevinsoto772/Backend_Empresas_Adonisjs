import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblUsuariosEmpresas extends BaseSchema {
  protected tableName = 'tbl_usuarios_empresas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('use_id').unique()
      table.string('use_nombre',200).notNullable()
      table.boolean('use_estado').defaultTo(true)
      table.timestamp('use_creacion', { useTz: true })
      table.timestamp('use_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
