const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const merge = require('deepmerge')
const { Estabelecimento } = require('../../entities')

const useCase = ({ estabelecimentoRepository }) => () =>
  usecase('Atualiza Estabelecimento', {
    request: {
     id: String,
     estabelecimento: Object
    },

    response: Estabelecimento,

    authorize: () => Ok(),

    'Checa se o estabelecimento é valido': step(async ctx => {
        // id do usuario é o e-mail
        const estabelecimento = await estabelecimentoRepository.buscaPorId(ctx.req.estabelecimento.email)

        if (!estabelecimento) {
            return Err.notFound()
        }

        const newEstabelecimento = merge.all([ estabelecimento[0], ctx.req.estabelecimento ])

        ctx.estabelecimento = Estabelecimento.fromJSON(newEstabelecimento)

        if (!ctx.estabelecimento.isValid()) return Err.invalidEntity({
            message: 'The Estabelecimento entity is invalid',
            payload: { entity: 'Estabelecimento' },
            cause: ctx.estabelecimento.errors
        })

        return Ok()
    }),

    'Atualiza o Usuario': step(async ctx => {
      return (ctx.ret = await estabelecimentoRepository.update(ctx.estabelecimento)) 
    })
  })

module.exports = useCase