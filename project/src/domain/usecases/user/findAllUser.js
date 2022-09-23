const { usecase, step, Ok } = require('@herbsjs/herbs')
const { User } = require('../../entities')

const useCase = ({ userRepository }) => () =>
  usecase('Find all Users', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [User],

    //Authorization with Audit
    authorize: () => Ok(),

    'Find and return all the Users': step(async ctx => {
      const result = await userRepository.findAll(ctx.req)
      
      // ctx.ret is the return value of a use case
      return (ctx.ret = result.map(user => User.fromJSON(user)))
    })
  })

module.exports = useCase
