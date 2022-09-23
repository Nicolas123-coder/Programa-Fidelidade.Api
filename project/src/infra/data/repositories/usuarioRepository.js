const { Repository } = require("@herbsjs/herbs2knex")
const { Usuario } = require('../../../domain/entities')

module.exports = class UsuarioRepository extends Repository {
    constructor(connection) {
        super({
            entity: Usuario,
            table: "usuarios",
            ids: ["id"],
            knex: connection
        })
    }
}
