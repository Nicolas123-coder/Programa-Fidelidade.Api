const repositories = require('../src/repositories')
const assert = require('assert')

describe('repositories', () => {
    it('should create an empty list', () => {
        assert.deepEqual(repositories.all, new Map())
    })

    it('should create an item with the provided id and repository', () => {
        class Repository { }
        const id = 'an id'

        const addedRepository = repositories.add(Repository, id)

        assert.equal(addedRepository.id, id)
        assert.equal(addedRepository.repository, Repository)
    })
})
