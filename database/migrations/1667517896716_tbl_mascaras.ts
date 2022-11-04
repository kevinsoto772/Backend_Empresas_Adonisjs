import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_mascaras'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('mas_id').unique()
      table.string('mas_valor',200).notNullable()
      table.boolean('mas_estado').defaultTo(true)
      table.timestamp('mas_creacion', { useTz: true })
      table.timestamp('mas_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
