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

    //TODO: Mudar pra buscar pelo ID de fato,
    //N fizemos isso agr pq tem usecase usando esse método
    async buscaPorId(id) {
        const estabelecimento = await this.runner()
        .where({ email: id })

        return estabelecimento
    }
}
