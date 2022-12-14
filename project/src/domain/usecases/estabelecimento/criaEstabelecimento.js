const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { Estabelecimento } = require('../../entities')

const useCase = ({ estabelecimentoRepository }) => () =>
  usecase('Cria Estabelecimento', {
    request: {
     estabelecimento:  Object,
    },

    response: Estabelecimento,

    authorize: () => Ok(),

    'Checa se o estabelecimento é valido': step(ctx => {
      ctx.estabelecimento = Estabelecimento.fromJSON(ctx.req.estabelecimento)

      ctx.estabelecimento.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.estabelecimento.isValid()) 
        return Err.invalidEntity({
          message: 'A entidade Estabelecimento é inválida', 
          payload: { entity: 'Estabelecimento' },
          cause: ctx.estabelecimento.errors 
        })
      
      return Ok() 
    }),

    'Verifica se já existe um e-mail cadastrado': step(async ctx => {
      const estabelecimento = await estabelecimentoRepository.buscaPorId(ctx.estabelecimento.email)

      if (estabelecimento[0]) {
        return Err.alreadyExists({
          message: 'O e-mail já está cadastrado para o estabelecimento', 
          payload: { entity: 'Estabelecimento' },
          cause: ctx.estabelecimento.errors 
        })
      }

      return Ok()
    }),

    'Salva o Estabelecimento': step(async ctx => {
      return (ctx.ret = await estabelecimentoRepository.insert(ctx.estabelecimento)) 
    })
  })

module.exports = useCase