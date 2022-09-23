exports.up = async function (knex) {
    knex.schema.hasTable('estabelecimentos')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('estabelecimentos', function (table) {
                    table.string('id').primary()
                    table.string('email')
                    table.string('nome')
                    table.string('senha')
                    table.string('telefone')
                    table.string('cnpj')
                    table.string('nomeEstabelecimento')
                    table.string('tipoEstabelecimento')
                    table.string('enderecoEstabelecimento')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('estabelecimentos')
}