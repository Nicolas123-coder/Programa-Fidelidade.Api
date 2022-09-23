const updateUser = require('./updateUser')
const assert = require('assert')
const { User } = require('../../entities')


describe('Update user', () => {
  const authorizedUser = { hasAccess: true }

  describe('Valid user', () => {

    it('should update user if is valid', async () => {
      // Given
      const retInjection = User.fromJSON({ 
        id: 99,
        nickname: 'a text',
        password: 'a text'
      })
      const injection = {
        userRepository: new ( class UserRepository {
          async findByID(id) { return ([retInjection]) }
          async update(id) { return true }
        })
      }

      const req = {
        id: 99,
        nickname: 'a text',
        password: 'a text'
      }

      // When
      const uc = updateUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })

  describe('Invalid user', () => {

    it('should not update invalid User', async () => {
      // Given
      const injection = {}
      const req = { 
        id: true,
        nickname: true,
        password: true
      }

      // When
      const uc = updateUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })

    it('should not update non existing User', async () => {
      // Given
      const retInjection = null
      const injection = {
        userRepository: new ( class UserRepository {
          async findByID(id) { return (retInjection) }
          async update(id) { return true }
        })
      }

      const req = { id: 0, nickname: 'herbsUser', password: 'V&eryStr0ngP@$$' }

      // When
      const uc = updateUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.ok(ret.isNotFoundError)
    })
  })
})
