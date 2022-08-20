const usecases = require('./usecases')
const entities = require('./entities')
const specs = require('./specs')
const repositories = require('./repositories')
const crud = require('./crud')
const requireAll = require('./requireAll')

module.exports = {
    herbarium: {
        requireAll,
        entities,
        usecases,
        specs,
        repositories,
        crud
    }
}