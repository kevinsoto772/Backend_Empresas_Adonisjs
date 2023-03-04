import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblArchivos extends BaseSchema {
  protected tableName = 'tbl_archivos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('arc_id').unique()
      table.string('arc_nombre', 200).notNullable()
      table.integer('arc_tipo') // certificaciones | reclamaciones
      table.string('arc_prefijo', 10)
      table.string('arc_prefijo_archivo', 10)
      table.boolean('arc_estado').defaultTo(true)
      table.uuid('arc_formato_id').references('for_id').inTable('tbl_formato_archivos')
      table.text('arc_descripcion')
      table.timestamp('arc_creacion', { useTz: true })
      table.timestamp('arc_actualizacion', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
