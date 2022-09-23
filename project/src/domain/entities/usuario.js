const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Entidade =
        entity('Usuario', {
          id: id(String),
          email: field(String),
          nome: field(String),
          senha: field(String),
          categoria: field(String),
          cnpj: field(String),
          nomeEstabelecimento: field(String),
          telefone: field(String),
          tipoEstabelecimento: field(String),
          enderecoEstabelecimento: field(String),
        })

module.exports =
  herbarium.entities
    .add(Entidade, 'Entidade')
    .entity
