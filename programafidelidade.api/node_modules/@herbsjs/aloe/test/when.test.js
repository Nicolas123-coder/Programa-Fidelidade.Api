const { when } = require('../src/when.js')
const assert = require('assert')
const { state } = require('../src/runningState.js')

describe('A when function', () => {
  context('before run', () => {
    const givenAPassingWhenFunction = () => {
      const instance = when(() => true)
      return instance
    }

    it('should validate its structure')

    it('should document its structure', async () => {
      //given
      const factory = givenAPassingWhenFunction()
      const instance = factory.create('A "When" description')

      //when
      const ret = await instance.doc()

      //then
      assert.deepStrictEqual(
        ret,
        { type: 'when', description: 'A "When" description' },
      )
    })
  })

  context('passing', () => {
    const givenAPassingWhenFunction = () => {
      return when(() => true)
    }

    it('should run', async () => {
      //given
      const factory = givenAPassingWhenFunction()
      const instance = factory.create('A scenario')
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.done)
    })

    it('should audit after run', async () => {
      //given
      const factory = givenAPassingWhenFunction()
      const instance = factory.create('A scenario')
      //when
      const ret = await instance.run()
      //then
      assert.deepStrictEqual(instance.auditTrail, { type: 'when', state: 'done', description: 'A scenario' })
    })
  })

  context('failing', () => {
    const givenAFailingWhenFunction = () => {
      return when(() => {
        throw new Error('A error from a when function')
      })
    }

    it('should run', async () => {
      //given
      const factory = givenAFailingWhenFunction()
      const instance = factory.create('A scenario')
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.failed)
    })

    it('should audit after run', async () => {
      //given
      const factory = givenAFailingWhenFunction()
      const instance = factory.create('A scenario')

      //when
      const ret = await instance.run()
      //then
      assert.deepStrictEqual(instance.auditTrail, {
        type: 'when',
        state: 'failed',
        description: 'A scenario',
        error: Error('A error from a when function')
      })
    })
  })
})
