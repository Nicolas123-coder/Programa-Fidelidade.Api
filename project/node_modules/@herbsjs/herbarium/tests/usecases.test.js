const usecases = require('../src/usecases')
const assert = require('assert')
const { usecase } = require('@herbsjs/herbs')

describe('usecases', () => {
    it('should create an empty list', () => {
        assert.deepEqual(usecases.all, new Map())
    })

    it('should throw an error when no id is provided and the usecase has no description', () => {
        assert.throws(() => usecases.add(class { }), /^Error: id cannot be empty$/)
    })

    it('should create an item with the provided id and usecase', () => {
        const myUsecase = usecase('My Usecase', { })

        const id = 'an id'

        const addedUsecase = usecases.add(myUsecase, id)

        assert.equal(addedUsecase.id, id)
        assert.equal(addedUsecase.usecase, myUsecase)
    })

    it('should create an item with the usecase description in pascalcase as id when no id is provided', () => {
        const myUsecaseWithDescription = usecase('my usecase description', {})

        const addedUsecase = usecases.add(myUsecaseWithDescription)

        assert.equal(addedUsecase.id, 'MyUsecaseDescription')
        assert.equal(addedUsecase.usecase, myUsecaseWithDescription)
    })
})
