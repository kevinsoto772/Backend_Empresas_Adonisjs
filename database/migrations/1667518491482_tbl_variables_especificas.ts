import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_variables_especificas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('vre_id').unique()
      table.string('vre_mombre',200)
      table.string('vre_descripcion',255)
      table.string('vre_tipo',100).comment('int, varchar, float, boolean')
      table.uuid('vre_mascara_id').references('mas_id').inTable('tbl_mascaras').comment('Formato')
      table.integer('vre_longitud')
      table.string('vre_valor_inicial',100)
      table.string('vre_valor_final',100)
      table.integer('vre_decimales')
      table.boolean('vre_maestra').defaultTo(false)
      table.uuid('vre_maestra_id').references('mae_id').inTable('tbl_maestras')
      table.uuid('vre_usuario_id').references('use_id').inTable('tbl_usuarios_empresas')
      table.boolean('vre_estado').defaultTo(true)
      table.boolean('vre_obligatoria').defaultTo(false)
      table.timestamp('vre_creacion', { useTz: true })
      table.timestamp('vre_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}