const path = require('path')
const reqAll = require('require-all')
const fs = require('fs')

function requireAllIfExist(options) {
    if (!fs.existsSync(options.dirname)) return
    return reqAll(options)
}

module.exports = function requireAll(options = {}) {
    const initialPath = options.initialPath || process.cwd()
    const __dir = initialPath.split(path.sep).join(path.posix.sep)

    const avoidSpecs = options.avoidFiles ||
        ((fileName) => (fileName.includes('.spec.js') || fileName.includes('.test.js') ? false : fileName))
    const onlySpecs = options.onlySpecs ||
        ((fileName) => (fileName.includes('.spec.js') ? fileName : false))

    const filesReqAll = { entities: {}, usecases: {}, specs: {}, repositories: {} }
    let files

    // entities
    files = requireAllIfExist({ dirname: __dir + (options.entitiesPath || '/src/domain/entities'), filter: avoidSpecs })
    filesReqAll.entities = files

    // usecases
    files = requireAllIfExist({ dirname: __dir + (options.usecasesPath || '/src/domain/usecases'), filter: avoidSpecs })
    filesReqAll.usecases = files

    // specs
    files = requireAllIfExist({ dirname: __dir + (options.specPath || '/src/domain/'), filter: onlySpecs })
    filesReqAll.specs = files

    // repositories
    files = requireAllIfExist({ dirname: __dir + (options.repositoriesPath || '/src/infra/repositories'), filter: avoidSpecs })
    filesReqAll.repositories = files

    return filesReqAll
}

