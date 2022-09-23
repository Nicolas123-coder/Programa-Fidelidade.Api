const createUser = require('./createUser')
const assert = require('assert')


describe('Create user', () => {
  const authorizedUser = { hasAccess: true }

  describe('Valid user', () => {

    it('should add user if is valid', async () => {
      // Given
      const injection = {
        userRepository: new ( class UserRepository {
          async insert(user) { return (user) }
        })
      }

      const req = {
        nickname: 'a text',
        password: 'a text'
      }

      // When
      const uc = createUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      
      assert.strictEqual(ret.ok.isValid(), true)

    })
  })

  describe('Invalid user', () => {

    it('should not create invalid user', async () => {
      // Given
      const injection = {}

      const req = {
        nickname: true,
        password: true
      }

      // When
      const uc = createUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
    })
  })
})
