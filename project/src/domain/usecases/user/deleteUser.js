const { usecase, step, Ok } = require('@herbsjs/herbs')
const { User } = require('../../entities')

const useCase = ({ userRepository }) => () =>
  usecase('Delete the User', {
    // Input/Request metadata and validation 
    request: {
      id: Number
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteUser ? Ok() : Err()),
    authorize: () => Ok(),

    'Delete the User': step(async ctx => {
      const user = User.fromJSON({ id: ctx.req.id })
      await userRepository.delete(user)
      return Ok()
    })
  })

module.exports = useCase