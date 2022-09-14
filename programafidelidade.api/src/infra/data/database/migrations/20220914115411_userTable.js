
exports.up = async function (knex) {
    knex.schema.hasTable('users')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('users', function (table) {
                    table.string('id').primary()
                    table.string('email')
                    table.string('nome')
                    table.string('senha')
                    table.string('categoria')
                    table.string('cnpj')
                    table.string('nome_estabelecimento')
                    table.string('telefone')
                    table.string('tipo_estabelecimento')
                    table.string('endereco_restaurante')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('users')
}
