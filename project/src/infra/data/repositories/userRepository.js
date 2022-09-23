const { Repository } = require("@herbsjs/herbs2knex")
const { User } = require('../../../domain/entities')

module.exports = class UserRepository extends Repository {
    constructor(connection) {
        super({
            entity: User,
            table: "users",
            ids: ["id"],
            knex: connection
        })
    }
}
