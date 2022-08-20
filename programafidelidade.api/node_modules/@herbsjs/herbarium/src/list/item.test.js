const item = require('./item')
const assert = require('assert')

describe('item', () => {
    it('should return an object with the provided id', () => {
        const id = 'my id'
        const createdItem = item(id)
        assert.equal(createdItem.id, id)
    })

    context('metadata method', () => {
        it('should return the item with the provided metadata attached to it', () => {
            const id = 'my item id'
            const createdItem = item(id)

            const metadata = {
                someImportantThing: true
            }

            const itemWithMetadata = createdItem.metadata(metadata)

            assert.deepEqual(itemWithMetadata, { ...createdItem, ...metadata })
        })
    })
})
