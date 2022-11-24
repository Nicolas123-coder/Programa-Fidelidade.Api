const { entity, field } = require('@herbsjs/herbs')

const Programa =
        entity('Programa', {
            id: field(Number),
            idEstabelecimento: field(String),
            nome: field(String),
            descricao: field(String),
            dataInicio: field(String),
            dataTermino: field(String),
            pontosNecessarios: field(Number),
            premio: field(String),
        })

module.exports = Programa
