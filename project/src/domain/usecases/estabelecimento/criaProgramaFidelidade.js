const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { Programa } = require('../../entities')

const useCase = ({ programaRepository }) => () =>
  usecase('Cria Programa de Fidelidade', {
    request: {
     programaFidelidade:  Object,
    },

    response: Programa,

    authorize: () => Ok(),

    'Checa se o programa é valido': step(ctx => {
      ctx.programa = Programa.fromJSON(ctx.req.programaFidelidade)

      ctx.programa.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.programa.isValid()) 
        return Err.invalidEntity({
          message: 'A entidade Programa é inválida', 
          payload: { entity: 'Programa' },
          cause: ctx.programa.errors 
        })
      
      return Ok() 
    }),

    'Salva o Programa': step(async ctx => {
      return (ctx.ret = await programaRepository.insert(ctx.programa)) 
    })
  })

module.exports = useCase