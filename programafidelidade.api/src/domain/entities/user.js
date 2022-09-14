const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const User =
        entity('User', {
          id: id(String),
          email: field(String),
          nome: field(String),
          senha: field(String, { validation: { presence: true, length: { minimum: 4 } } }),
          categoria: field(String),
          cnpj: field(String),
          nomeEstabelecimento: field(String),
          telefone: field(String),
          tipoEstabelecimento: field(String),
          enderecoRestaurante: field(String),
        })

module.exports =
  herbarium.entities
    .add(User, 'User')
    .entity
