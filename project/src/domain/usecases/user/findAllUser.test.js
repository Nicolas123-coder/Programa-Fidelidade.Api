const findAllUser = require('./findAllUser')
const assert = require('assert')

describe('Find all users', () => {
    const authorizedUser = { hasAccess: true }

    it('should return all users', async () => {
      // Given
      const req = { limit:0, offset:0}
      const injection = {
        userRepository: new ( class UserRepository {
          async  findAll() { return [] }
        })
      }

      // When
      const uc = findAllUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)
    })
})
