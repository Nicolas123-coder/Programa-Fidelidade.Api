exports.up = async function (knex) {
    knex.schema.hasTable('programas')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('programas', function (table) {
                    table.string('id').primary()
                    table.string('id_estabelecimento').references('estabelecimentos.id')
                    table.string('nome_programa')
                    table.integer('pontos_necessarios')
                    table.string('premio')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('programas')
}