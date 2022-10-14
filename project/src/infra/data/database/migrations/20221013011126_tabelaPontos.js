exports.up = async function (knex) {
    knex.schema.hasTable('pontos')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('pontos', function (table) {
                    table.string('id_usuario').references('usuarios.id')
                    table.string('id_estabelecimento').references('estabelecimentos.id')
                    table.increments('pontos')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('pontos')
}