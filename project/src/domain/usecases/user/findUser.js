const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { User } = require('../../entities')

const useCase = ({ userRepository }) => () =>
  usecase('Find a User', {
    // Input/Request metadata and validation 
    request: {
      id: Number,
    },

    // Output/Response metadata
    response: User,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneUser ? Ok() : Err()),
    authorize: () => Ok(),

    'Find and return the User': step(async ctx => {
      const id = ctx.req.id
      const [result] = await userRepository.findByID(id) 
      if (!result) return Err.notFound({ 
        message: `User entity not found by ID: ${id}`,
        payload: { entity: 'User', id }
      })
      
      // ctx.ret is the return value of a use case
      return (ctx.ret = User.fromJSON(result))
    })
  })

module.exports = useCase