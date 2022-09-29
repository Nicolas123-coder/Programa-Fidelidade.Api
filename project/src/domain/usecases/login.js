const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { User, Usuario, Estabelecimento } = require('../../domain/entities')

// TODO: fazer um usecase de login para cada caso (usuario e estabelecimento)
//       no front ter um radio de se é estabelecimento ou usuario 

const useCase = ({ usuarioRepository, estabelecimentoRepository }) => () =>
  usecase('Autentica um usuário', {
    request: {
      email: String,
      senha: String,
      tipoUsuario: String
    },

    response: Object,

    authorize: () => Ok(),

    'Busca um usuário e autentica ele': step(async ctx => {
        if (ctx.req.tipoUsuario == 'usuario') {
            const [result] = await usuarioRepository.buscaPorId(ctx.req.email)
                
            if(!result) return Err.notFound({ 
                message: `Usuário não encontrado: ${ctx.req.email}`,
                payload: { entity: 'Usuario' }
            })

            if(result?.email === ctx.req.email && result?.senha === ctx.req.senha) {
                return (ctx.ret = result)
                // return (ctx.ret = Usuario.fromJSON(result))
            }

            else {
                return Err.permissionDenied({
                    message: `Login inválido: ${ctx.req.email}`,
                    payload: { entity: 'Usuario' }
                  })
            }
        }
    }),

    'Busca um estabelecimento e autentica ele': step(async ctx => {
        console.log(ctx.req.tipoUsuario)
        if (ctx.req.tipoUsuario == 'estabelecimento') {
            const [result] = await estabelecimentoRepository.buscaPorId(ctx.req.email)
                
            if(!result) return Err.notFound({ 
                message: `Estabelecimento não encontrado: ${ctx.req.email}`,
                payload: { entity: 'Estabelecimento' }
            })

            if(result?.email == ctx.req.email && result?.senha == ctx.req.senha) {
                return (ctx.ret = result)
                // return (ctx.ret = Estabelecimento.fromJSON(result))
            }

            else {
                return Err.permissionDenied({
                    message: `Login inválido: ${ctx.req.email}`,
                    payload: { entity: 'Estabelecimento' }
                  })
            }
        } 
    })
  })

module.exports = useCase