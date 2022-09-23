const criaEstabelecimento = require('../estabelecimento/criaEstabelecimento')
const assert = require('assert')


describe('Cria um estabelecimento', () => {
  const authorizedUser = { hasAccess: true }

  describe('Estabelecimento Válido', () => {

    it('Deve adicionar um estabelecimento se ele for válido', async () => {
      // Given
      const injection = {
        estabelecimentoRepository: new ( class EstabelecimentoRepository {
          async insert(user) { return (user) }
        })
      }

      const req = {
        estabelecimento : {
          email: "nicolasdbarros@yahoo.com.br",
          nome: "Nicolas o pica",
          senha: "senha567",
          cnpj: "cnpjTeste",
          nomeEstabelecimento: "restaurante1234",
          tipoEstabelecimento: "bar",
          enderecoEstabelecimento: "Rua capote valente 136",
          telefone: "982772121"
        }
      }

      // When
      const uc = criaEstabelecimento(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('Estabelecimento Inválido', () => {

    it('Não deve criar um estabelecimento quando inválido', async () => {
      // Given
      const injection = {}

      const req = {
        estabelecimento111111 : {
          email: "nicolasdbarros@yahoo.com.br",
          nome: "Nicolas o pica",
          senha: "senha567",
          cnpj: "cnpjTeste",
          nomeEstabelecimento: "restaurante1234",
          tipoEstabelecimento: "bar",
          enderecoEstabelecimento: "Rua capote valente 136",
          telefone: "982772121"
        }
    }
      // When
      const uc = criaEstabelecimento(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })
  })
})
