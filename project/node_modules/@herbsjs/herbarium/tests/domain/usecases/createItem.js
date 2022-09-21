const { Ok, Err, usecase, step } = require('@herbsjs/herbs')
const { herbarium } = require('../../../src/herbarium')
const { Item } = require('../entities/item')

const dependency = {

}

const createItem = (injection) =>
  usecase('Create Item', {
    request: { listId: Number, description: String, isDone: Boolean },

    response: Item,

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    authorize: async (user) => (user.canCreateItem ? Ok() : Err()),

    'Check if the Item is valid': step((ctx) => {
      const req = ctx.req
      const item = ctx.item = new Item()
      item.id = Math.floor(Math.random() * 100000)
      item.description = req.description
      item.isDone = req.isDone
      item.listId = req.listId

      if (!item.isValid()) return Err.invalidEntity({
        message: `Item is invalid`,
        payload: { entity: 'item' },
        cause: JSON.stringify(item.errors)
      })

      return Ok()
    })

  })

module.exports.createItem = createItem
