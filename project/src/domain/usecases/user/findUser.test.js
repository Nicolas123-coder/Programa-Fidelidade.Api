const getUserById = require('./findUser')
const assert = require('assert')
const { User } = require('../../entities')

describe('Find a user', () => {
  const authorizedUser = { hasAccess: true }

  describe('Valid scenarios', () => {

    it('should return user', async () => {
      // Given 
      const mock = {
        id: 99,
        nickname: 'a text',
        password: 'a text'
      }

      const injection = {
        userRepository: new ( class UserRepository {
          async  findByID(id) { return ([User.fromJSON(mock)]) }
        })
      }

      const req = {
        id: 99
      }

      // When
      const uc = getUserById(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)
      assert.strictEqual(JSON.stringify(ret.ok), JSON.stringify({id: ret.ok.id,...mock}))
    })
  })

  describe('Error scenarios', () => {

    it('return notFoundError', async () => {
      // Given
      const injection = {
        userRepository: new ( class UserRepository {
          async  findByID(id) { return ([]) }
        })
      }

      const req = {
        id: null
      }

      // When
      const uc = getUserById(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
