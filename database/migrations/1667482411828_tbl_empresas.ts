import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblEmpresas extends BaseSchema {
  protected tableName = 'tbl_empresas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('emp_id')
      table.string('emp_nombre',200).notNullable()
      table.integer('emp_nit')
      table.boolean('emp_estado').defaultTo(true)
      table.timestamp('emp_creacion', { useTz: true })
      table.timestamp('emp_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
