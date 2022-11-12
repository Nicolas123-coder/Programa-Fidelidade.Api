const { entity, field } = require('@herbsjs/herbs')

const Usuario =
        entity('Usuario', {
            id: field(Number),
            email: field(String, {
                validation: { presence: true }
            }),
            nome: field(String, {
                validation: { presence: true }
            }),
            senha: field(String, {
                validation: { presence: true }
            }),
            telefone: field(String, {
                validation: { presence: true }
            }),
        })

module.exports = Usuario
