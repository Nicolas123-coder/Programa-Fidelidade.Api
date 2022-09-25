const criaUsuario = require('./criaUsuario')
const assert = require('assert')


describe('Cria um usuário', () => {
  const authorizedUser = { hasAccess: true }

  describe('Usuário Válido', () => {

    it.only('Deve adicionar um usuário se ele for válido', async () => {
      // Given
      const injection = {
        usuarioRepository: new ( class UsuarioRepository {
          async insert(user) { return (user) }
          async buscaPorId() { return [] }
        })
      }

      const req = {
        usuario : {
          email: "nicolasdbarros@yahoo.com.br",
          nome: "Nicolas de Barros",
          senha: "senha567",
          telefone: "982772121"
        }
      }

      // When
      const uc = criaUsuario(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('Usuário Inválido', () => {

    it.only('Não deve criar um usuário quando inválido', async () => {
      // Given
      const injection = {}

      const req = {
        usuario : {
          email: 3,
          nome: "Nicolas de Barros",
          senha: "senha567",
          telefone: "982772121"
        }
      }
      // When
      const uc = criaUsuario(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })

    it.only('Não deve cadastrar um usuário quando ele já existir', async () => {
      // Given
      const injection = { 
        usuarioRepository: new ( class UsuarioRepository {
          async buscaPorId() { return [ { },{ } ] }
        })
      }

      const req = {
        usuario : {
          email: 3,
          nome: "Nicolas de Barros",
          senha: "senha567",
          telefone: "982772121"
        }
      }

      // When
      const uc = criaUsuario(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })
  })
})
