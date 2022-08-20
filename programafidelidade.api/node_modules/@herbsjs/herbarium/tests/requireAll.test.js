const requireAll = require('../src/requireAll')
const assert = require('assert')

describe('requireAll', () => {

  it('should validate files with default domain folders', () => {

    const reqAll = requireAll()

    assert.equal(reqAll.entities, undefined)
    assert.equal(reqAll.repositories, undefined)
    assert.equal(reqAll.usecases, undefined)

  })

  it('should validate files with custom domain entities folders', () => {

    var options = {
      entitiesPath: '/tests/domain/entities',
      usecasesPath: '/tests/domain/usecases',
      specPath: '/tests/domain/'
    }
    const reqAll = requireAll(options)

    assert.equal(Object.keys(reqAll.entities)[0], 'item.js')
    assert.equal(Object.keys(reqAll.entities).length, 1)
    assert.equal(Object.keys(reqAll.usecases)[0], 'createItem.js')
    assert.equal(Object.keys(reqAll.usecases).length, 1)
    assert.equal(Object.keys(reqAll.specs.usecases)[0], 'createItem.spec.js')
    assert.equal(Object.keys(reqAll.specs.usecases).length, 1)
  })



})
