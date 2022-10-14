const { entity, field } = require('@herbsjs/herbs')

const Programa =
        entity('Programa', {
            id: field(Number),
            idEstabelecimento: field(String),
            nomePrograma: field(String),
            pontosNecessarios: field(Number),
            premio: field(String),
        })

module.exports = Programa
