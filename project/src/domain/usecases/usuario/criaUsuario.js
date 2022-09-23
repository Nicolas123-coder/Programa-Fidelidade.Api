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
          message: 'The User entity is invalid', 
          payload: { entity: 'Usuario' },
          cause: ctx.usuario.errors 
        })
      
      return Ok() 
    }),

    //TODO: Implementar verificação
    
    // 'Verifica se já existe um e-mail cadastrado': step(async ctx => {
    //   const resultado = await usuarioRepository.findByID(ctx.usuario.id)

    //   console.log(resultado)

    //   if (resultado[0].email == ctx.usuario.email) {
    //     console.log("eroooooooooo pqp")
    //   }

    //   return Ok()
    // }),

    'Salva o Usuario': step(async ctx => {
      return (ctx.ret = await usuarioRepository.insert(ctx.usuario)) 
    })
  })

module.exports = useCase