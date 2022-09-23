const { entity, field } = require('@herbsjs/herbs')

const Estabelecimento =
        entity('Estabelecimento', {
            id: field(Number),
            email: field(String),
            nome: field(String),
            senha: field(String),
            cnpj: field(String),
            nomeEstabelecimento: field(String),
            telefone: field(String),
            tipoEstabelecimento: field(String),
            enderecoEstabelecimento: field(String),
        })

module.exports = Estabelecimento
