const item = require('./list/item')
const list = require('./list/list')
const usecases = new Map()
const { toPascalCase } = require('./tools')

const builder = (usecase, id) => {
    const usecaseId = id || toPascalCase(usecase.description)
    if (!usecaseId) throw new Error('id cannot be empty')

    const defaultItem = item(usecaseId)
    const usecaseItem = Object.assign({}, defaultItem, {
        usecase,
        operation: undefined,
        entity: undefined,
        group: undefined
    })
    return usecaseItem
}

module.exports = list(usecases, builder)