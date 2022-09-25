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

    async buscaPorId(id) {
        const estabelecimento = await this.runner()
        .where({ email: id })

        return estabelecimento
    }
}
