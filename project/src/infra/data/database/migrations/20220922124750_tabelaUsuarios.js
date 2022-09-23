
exports.up = async function (knex) {
    knex.schema.hasTable('usuarios')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('usuarios', function (table) {
                    table.string('id').primary()
                    table.string('email')
                    table.string('nome')
                    table.string('senha')
                    table.string('telefone')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('usuarios')
}
