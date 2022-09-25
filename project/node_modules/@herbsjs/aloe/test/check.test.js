const { check } = require('../src/check.js')
const assert = require('assert')
const { state } = require('../src/runningState.js')

describe('A check function', () => {
  context('before run', () => {
    const givenAPassingCheckFunction = () => {
      const instance = check(() => true)
      return instance
    }

    it('should validate its structure')

    it('should document its structure', async () => {
      //given
      const factory = givenAPassingCheckFunction()
      const instance = factory.create('A "Check" description')

      //when
      const ret = await instance.doc()

      //then
      assert.deepStrictEqual(
        ret,
        { type: 'check', description: 'A "Check" description' },
      )
    })
  })

  context('passing', () => {
    const givenAPassingCheckFunction = () => {
      return check(() => true)
    }

    it('should run', async () => {
      //given
      const factory = givenAPassingCheckFunction()
      const instance = factory.create('')
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.passed)
    })

    it('should audit after run', async () => {
      //given
      const factory = givenAPassingCheckFunction()
      const instance = factory.create('')
      //when
      const ret = await instance.run()
      //then
      assert.deepStrictEqual(instance.auditTrail, { type: 'check', state: 'passed', description: '' })
    })

  })

  context('failing', () => {
    const givenAFailingCheckFunction = () => {
      return check(() => {
        throw new Error('A error from a check function')
      })
    }

    it('should run', async () => {
      //given
      const factory = givenAFailingCheckFunction()
      const instance = factory.create('')

      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.failed)
    })

    it('should audit after run', async () => {
      //given
      const factory = givenAFailingCheckFunction()
      const instance = factory.create('')

      //when
      const ret = await instance.run()
      //then
      assert.deepStrictEqual(instance.auditTrail, {
        type: 'check',
        state: 'failed',
        description: '',
        error: Error('A error from a check function')
      })
    })
  })

})
