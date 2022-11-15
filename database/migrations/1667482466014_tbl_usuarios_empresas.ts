import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TblUsuariosEmpresas extends BaseSchema {
  protected tableName = 'tbl_usuarios_empresas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('use_id').unique()
      table.string('use_nombre', 200).notNullable()
      table.string('use_apellido', 255)
      table.integer('use_identificacio').unique()
      table.string('use_clave_temporal', 255)
      table.string('use_usuario', 255)
      table.string('use_clave', 255)
      table.dateTime('use_fechaNacimiento')
      table.string('use_cargo', 255)
      table.string('use_telefono', 255)
      table.string('use_correo', 255)
      table.uuid('use_empresa_id').references('emp_id').inTable('tbl_empresas')
      table.boolean('use_estado').defaultTo(true)
      table.timestamp('use_creacion', { useTz: true })
      table.timestamp('use_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
