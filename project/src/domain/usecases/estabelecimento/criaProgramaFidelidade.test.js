const criaPrograma = require('../estabelecimento/criaProgramaFidelidade')
const assert = require('assert')


describe('Cria um programa de fidelidade', () => {
  const authorizedUser = { hasAccess: true }

  describe('Programa Fidelidade Válido', () => {

    it.only('Deve adicionar um programa de fidelidade se ele for válido', async () => {
      // Given
      const injection = {
        programaRepository: new ( class ProgramaRepository {
          async insert(user) { return (user) }
          async buscaPorId() { return [] }
        })
      }

      const req = {
        programaFidelidade : {
          idEstabelecimento: '89313',
          nome: "nome exemplo",
          descricao: "descricao",
          dataInicio: "12/12/2022",
          dataTermino: "24/12/2022",
          pontosNecessarios: 4,
        }
      }

      // When
      const uc = criaPrograma(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('Programa Inválido', () => {

    it.only('Não deve criar um programa de fidelidade quando inválido', async () => {
      // Given
      const injection = {
        programaRepository: new ( class ProgramaRepository {
            async insert(user) { return (user) }
            async buscaPorId() { return [] }
        })
      }

      const req = {
        programaFidelidade : {
            idEstabelecimento: 89313,
            nome: "nome exemplo",
            descricao: "descricao",
            dataInicio: "12/12/2022",
            dataTermino: "24/12/2022",
            pontosNecessarios: '4',
        }
    }
      // When
      const uc = criaPrograma(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })
  })
})
