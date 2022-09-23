const { Repository } = require("@herbsjs/herbs2knex")
const { Estabelecimento } = require('../../../domain/entities')

module.exports = class UsuarioRepository extends Repository {
    constructor(connection) {
        super({
            entity: Estabelecimento,
            table: "estabelecimentos",
            ids: ["id"],
            knex: connection
        })
    }
}
