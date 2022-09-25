const createItem = require('./createItem')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs

const createItemSpec = spec({
    usecase: createItem,
    'Create a new item when it is valid': scenario({
        'Given a valid item': given({
            request: {
                nickname: 'a text',
                password: 'a text'
            },
            item: { hasAccess: true },
            injection: {
                itemRepository: new (class ItemRepository {
                    async insert(item) { return (item) }
                })
            },
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid item': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
            // TODO: check if it is really a item
        })

    }),

    'Do not create a new item when it is invalid': scenario({
        'Given a invalid item': given({
            request: {
                nickname: true,
                password: true
            },
            item: { hasAccess: true },
            injection: {
                itemRepository: new (class ItemRepository {
                    async insert(item) { return (item) }
                })
            },
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            // assert.ok(ctx.response.isInvalidEntityError)
        }),

    }),
})

module.exports = createItemSpec