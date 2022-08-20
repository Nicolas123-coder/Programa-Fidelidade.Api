const entities = require('../src/entities')
const assert = require('assert')
const { entity } = require('@herbsjs/herbs')

describe('entities', () => {
    it('should create an empty list', () => {
        assert.deepEqual(entities.all, new Map())
    })

    it('should throw an error when no id is provided and the entity has no name', () => {
        const entityWithNoName = {}
        assert.throws(() => entities.add(entityWithNoName), /^Error: id cannot be empty$/)
    })

    it('should create an item with the provided id and entity', () => {
        const anEntity = entity('an entity', {})
        const id = 'an id'

        const addedItem = entities.add(anEntity, id)

        assert.equal(addedItem.id, id)
        assert.equal(addedItem.entity, anEntity)
    })

    it('should create an item with the entity name in pascalcase as id when no id is provided', () => {
        const anEntity = entity('an entity', {})

        const addedItem = entities.add(anEntity)

        assert.equal(addedItem.id, 'AnEntity')
        assert.equal(addedItem.entity, anEntity)
    })
})
