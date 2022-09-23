const deleteUser = require('./deleteUser')
const assert = require('assert')


describe('Delete the user', () => {
  const authorizedUser = { hasAccess: true }

  describe('Valid user', () => {

    it('should delete the user if is valid', async () => {
      // Given
      const injection = {
        userRepository: new ( class UserRepository {
          async delete(entity) { return true }
        })
      }
      
      const req = {
        id: 99
      }

      // When
      const uc = deleteUser(injection)()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isOk)      

    })
  })

  describe('Invalid user', () => {

    it('should not delete the invalid User', async () => {
      // Given
      const req = { id : '5' }

      // When
      const uc = deleteUser({})()
      await uc.authorize(authorizedUser)
      const ret = await uc.run(req)

      // Then
      assert.ok(ret.isErr)
      assert.deepStrictEqual(ret.err, {request :[{id:[{wrongType:"Number"}]}]})
    })
  })
})
