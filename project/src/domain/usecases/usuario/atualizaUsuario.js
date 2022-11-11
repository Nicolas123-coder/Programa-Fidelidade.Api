const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const merge = require('deepmerge')
const { Usuario } = require('../../entities')

const useCase = ({ usuarioRepository }) => () =>
  usecase('Atualiza Usuario', {
    request: {
     id: String,
     usuario: Object
    },

    response: Usuario,

    authorize: () => Ok(),

    'Checa se o usuario é valido': step(async ctx => {
        // id do usuario é o e-mail
        const user = await usuarioRepository.buscaPorId(ctx.req.usuario.email)

        if (!user) {
            return Err.notFound()
        }

        const usuario = user[0]

        const newUsuario = merge.all([ usuario, ctx.req.usuario ])

        ctx.usuario = Usuario.fromJSON(newUsuario)

        console.log('usuario antigo : ',user)
        console.log('\nusuario novo :',newUsuario)

        if (!ctx.usuario.isValid()) return Err.invalidEntity({
            message: 'The Usuario entity is invalid',
            payload: { entity: 'Usuario' },
            cause: ctx.usuario.errors
        })

        return Ok()
    }),

    'Atualiza o Usuario': step(async ctx => {
      return (ctx.ret = await usuarioRepository.update(ctx.usuario)) 
    })
  })

module.exports = useCase