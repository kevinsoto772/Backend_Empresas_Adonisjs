import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblArchivosVariables extends BaseSchema {
  protected tableName = 'tbl_archivos_variables'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('arv_id')
      table.uuid('arv_variable_id')
      table.uuid('arv_archivo_id').references('arc_id').inTable('tbl_archivos')
      table.integer('posicion')
      table.string('arv_tipo',100).comment('especifica - transversal')
      table.boolean('arv_estado').defaultTo(true)
      table.timestamp('arv_creacion', { useTz: true })
      table.timestamp('arv_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
