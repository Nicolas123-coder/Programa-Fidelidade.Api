const { Repository } = require("@herbsjs/herbs2knex")
const { Programa } = require('../../../domain/entities')

module.exports = class UsuarioRepository extends Repository {
    constructor(connection) {
        super({
            entity: Programa,
            table: "programas",
            ids: ["id"],
            knex: connection
        })
    }

    async buscaPorId(id) {
        const programa = await this.runner()
        .where({ id: id })

        return programa
    }
}
