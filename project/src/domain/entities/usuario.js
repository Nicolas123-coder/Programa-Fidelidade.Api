const { entity, field } = require('@herbsjs/herbs')

const Usuario =
        entity('Usuario', {
            id: field(Number),
            email: field(String),
            nome: field(String),
            senha: field(String),
            telefone: field(String),
        })

module.exports = Usuario
