const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { Usuario } = require('../../entities')

const useCase = ({ usuarioRepository }) => () =>
  usecase('Cria Usuario', {
    request: {
     usuario:  Object
    },

    response: Usuario,

    authorize: () => Ok(),

    'Checa se o usuario é valido': step(ctx => {
      ctx.usuario = Usuario.fromJSON(ctx.req.usuario)

      ctx.usuario.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.usuario.isValid()) 
        return Err.invalidEntity({
          message: 'A entidade Usuário é inválida', 
          payload: { entity: 'Usuario' },
          cause: ctx.usuario.errors 
        })
      
      return Ok() 
    }),

    'Verifica se já existe um e-mail cadastrado': step(async ctx => {
      const usuario = await usuarioRepository.buscaPorId(ctx.usuario.email)

      if (usuario[0]) {
        return Err.alreadyExists({
          message: 'O e-mail já está cadastrado para o usuário', 
          payload: { entity: 'Usuario' },
          cause: ctx.usuario.errors 
        })
      }

      return Ok()
    }),

    'Salva o Usuario': step(async ctx => {
      return (ctx.ret = await usuarioRepository.insert(ctx.usuario)) 
    })
  })

module.exports = useCase