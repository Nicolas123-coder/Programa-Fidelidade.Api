const specs = require('../src/specs')
const assert = require('assert')
const { spec } = require('@herbsjs/herbs').specs

describe('specs', () => {
    it('should create an empty list', () => {
        assert.deepEqual(specs.all, new Map())
    })

    it('should throw an error when no id is provided', () => {
        assert.throws(() => specs.add(class { }), /^Error: id cannot be empty$/)
    })

    it('should create an item with the provided id and spec', () => {
        const mySpec = spec('My Spec', { })

        const id = 'an id'

        const addedSpec = specs.add(mySpec, id)

        assert.equal(addedSpec.id, id)
        assert.equal(addedSpec.spec, mySpec)
    })
})
