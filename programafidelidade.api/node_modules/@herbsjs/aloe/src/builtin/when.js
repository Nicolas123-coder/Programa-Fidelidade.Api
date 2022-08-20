const { Err } = require("@herbsjs/buchu")
const { when } = require("../when")

const builtinWhen = () => {
  const factory =
    when(async (ctx) => {
      const injection = ctx.injection
      const uc = ctx.usecase(injection)

      const hasAccess = await uc.authorize(ctx.user)

      if (hasAccess === false) {
        ctx.response = Err.permissionDenied()
        return
      }

      const request = ctx.request
      ctx.response = await uc.run(request)
    })

  const instance = factory.create('')
  instance.builtin = true
  return instance
}

module.exports.builtinWhen = builtinWhen