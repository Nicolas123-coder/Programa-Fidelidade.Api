const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { User } = require('../../entities')

const useCase = ({ userRepository }) => () =>
  usecase('Create User', {
    // Input/Request metadata and validation 
    request: {
      nickname: String,
      password: String
    },

    // Output/Response metadata
    response: User,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateUser ? Ok() : Err()),
    authorize: () => Ok(),

    //Step description and function
    'Check if the User is valid': step(ctx => {
      ctx.user = User.fromJSON(ctx.req)
      ctx.user.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.user.isValid()) 
        return Err.invalidEntity({
          message: 'The User entity is invalid', 
          payload: { entity: 'User' },
          cause: ctx.user.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the User': step(async ctx => {
      // ctx.ret is the return value of a use case
      return (ctx.ret = await userRepository.insert(ctx.user)) 
    })
  })

module.exports = useCase