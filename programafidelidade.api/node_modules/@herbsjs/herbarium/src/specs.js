const item = require('./list/item')
const list = require('./list/list')
const specs = new Map()

const builder = (spec, id) => {
    if (!id) throw new Error('id cannot be empty')

    const defaultItem = item(id)
    const specItem = Object.assign({}, defaultItem, {
        spec,
        entity: undefined,
        usecase: undefined,
        group: undefined
    })
    return specItem
}

module.exports = list(specs, builder)