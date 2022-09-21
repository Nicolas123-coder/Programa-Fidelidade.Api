const { scenario } = require('../src/scenario')
const assert = require('assert')
const { given } = require('../src/given')
const { when } = require('../src/when')
const { check } = require('../src/check')
const { samples } = require('../src/samples')
const { state } = require('../src/runningState')
const { Err } = require('@herbsjs/buchu')

describe('A scenario', () => {
  context('before run', () => {
    const givenTheSimplestScenario = () => {
      const instance = scenario({
        info: 'A simple scenario',
        'A Sample data': samples([
          { x: 1 },
          { x: 2 },
        ]),
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'b')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'x')
        }),
      })
      return instance
    }

    it('should validate its structure')

    it('should document its structure', async () => {
      //given
      const factory = givenTheSimplestScenario()
      const instance = factory.create('A "Scenario" description')

      //when
      const ret = await instance.doc()

      //then
      assert.deepStrictEqual(
        ret,
        {
          type: 'scenario',
          description: 'A "Scenario" description',
          info: 'A simple scenario',
          samples: [
            { type: 'samples', description: 'A Sample data', value: [{ x: 1 }, { x: 2 }], isFunction: false },
          ],
          givens: [
            { type: 'given', description: 'Given a input', value: { user: 'a' }, isFunction: true },
            { type: 'given', description: 'Given another input', value: { customer: 'x', project: 'w' }, isFunction: true }
          ],
          whens: [{ type: 'when', description: 'When running' }],
          checks: [
            { type: 'check', description: 'Check output' },
            { type: 'check', description: 'Check another output' }
          ]
        },
      )
    })
  })

  context('passing', () => {
    const givenTheSimplestScenario = () => {
      return scenario({
        info: 'A simple scenario',
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'b')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'x')
        }),
      })
    }

    it('should run', async () => {
      //given
      const factory = givenTheSimplestScenario()
      const instance = factory.create('A scenario')

      //when
      const ret = await instance.run()

      //then
      // - firts, it should not throw a exception, then:
      assert.ok(ret, state.passed)
      assert.strictEqual(instance.description, 'A scenario')
      assert.strictEqual(instance.info, 'A simple scenario')
      assert.strictEqual(instance.samples[0].description, '')
      assert.strictEqual(instance.samples[0].builtin, true)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].stage, 'check')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].state, state.passed)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].description, 'Given a input')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[1].description, 'Given another input')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[1].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].description, 'When running')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[0].description, 'Check output')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[0].state, state.passed)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[1].description, 'Check another output')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[1].state, state.passed)
    })

    it('should audit after run', async () => {
      //given
      const factory = givenTheSimplestScenario()
      const instance = factory.create('A scenario')

      //when
      const ret = await instance.run()
      //then
      assert.deepStrictEqual(instance.auditTrail, {
        type: "scenario", state: "passed", description: "A scenario",
        samples: [{
          builtin: true,
          executions: [{
            sample: {}, state: "passed", stage: "check",
            givens: [
              { type: "given", state: "done", description: "Given a input" },
              { type: "given", state: "done", description: "Given another input" }],
            whens: [
              { type: "when", state: "done", description: "When running" }],
            checks: [
              { type: "check", state: "passed", description: "Check output" },
              { type: "check", state: "passed", description: "Check another output" }]
          }]
        }]
      })
    })

    it('should not be allow to run more than once')
  })

  context('falling', () => {
    const givenTheSimplestScenario = () => {
      return scenario({
        info: 'A simple scenario',
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'a')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'z')
        }),
      })
    }

    it('should run', async () => {
      //given
      const factory = givenTheSimplestScenario()
      const instance = factory.create('A failed scenario')

      //when
      const ret = await instance.run()

      //then
      // - firts, it should not throw a exception, then:

      assert.ok(ret, state.failed)
      assert.strictEqual(instance.description, 'A failed scenario')
      assert.strictEqual(instance.info, 'A simple scenario')
      assert.strictEqual(instance.samples[0].description, '')
      assert.strictEqual(instance.samples[0].builtin, true)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].stage, 'check')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].state, state.failed)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].description, 'Given a input')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[1].description, 'Given another input')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[1].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].description, 'When running')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].state, state.done)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[0].description, 'Check output')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[0].state, state.failed)
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[1].description, 'Check another output')
      assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[1].state, state.failed)

    })

    it('should audit after run', async () => {
      //given
      const factory = givenTheSimplestScenario()
      const instance = factory.create('A failed scenario')
      //when
      const ret = await instance.run()
      //then
      assert.strictEqual(instance.auditTrail.state, state.failed)
      assert.strictEqual(instance.auditTrail.samples[0].executions[0].state, state.failed)
      assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[0].state, state.failed)
      assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[0].error.message, `The expression evaluated to a falsy value:\n\n  assert.ok(ctx.user === 'a')\n`)
      assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[1].state, state.failed)
      assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[1].error.message, `The expression evaluated to a falsy value:\n\n  assert.ok(ctx.customer === 'z')\n`)
    })

    it('should not be allow to run more than once')
  })

  context('with exceptions', () => {

    context('on Given', () => {

      const givenAScenarioWithException = () => {
        return scenario({
          'Given a input': given(() => { throw Error('A given error') }),
          'When running': when(() => { }),
          'Check output': check(() => { })
        })
      }

      it('should run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')

        //when
        const ret = await instance.run()

        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].stage, 'given')
        assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].state, state.failed)
      })

      it('should audit after run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')
        //when
        const ret = await instance.run()
        //then
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].givens[0].state, state.failed)
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].givens[0].error.message, `A given error`)
      })
    })

    context('on When', () => {

      const givenAScenarioWithException = () => {
        return scenario({
          'Given a input': given(() => { }),
          'When running': when(() => { throw Error(`A whens error`) }),
          'Check output': check(() => { })
        })
      }

      it('should run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')

        //when
        const ret = await instance.run()

        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].stage, 'when')
        assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].state, state.done)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].state, state.failed)
      })

      it('should audit after run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')

        //when
        const ret = await instance.run()
        //then
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].whens[0].state, state.failed)
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].whens[0].error.message, `A whens error`)
      })

    })

    context('on Check', () => {

      const givenAScenarioWithException = () => {
        return scenario({
          'Given a input': given(() => { }),
          'When running': when(() => { }),
          'Check output': check(() => { throw Error(`A check error`) })
        })
      }

      it('should run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')

        //when
        const ret = await instance.run()

        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].stage, 'check')
        assert.strictEqual(instance.samples[0].execution.scenarios[0].givens[0].state, state.done)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].whens[0].state, state.done)
        assert.strictEqual(instance.samples[0].execution.scenarios[0].checks[0].state, state.failed)
      })

      it('should audit after run', async () => {
        //given
        const factory = givenAScenarioWithException()
        const instance = factory.create('A scenario with exception')
        //when
        const ret = await instance.run()
        //then
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[0].state, state.failed)
        assert.strictEqual(instance.auditTrail.samples[0].executions[0].checks[0].error.message, `A check error`)
      })

    })
  })

  context('with samples', () => {

    const givenTheScenarioWithSamples = () => {
      return scenario({
        'Sample1': samples([
          { x: 1, y: 1, result: 2 },
          { x: 2, y: 2, result: 4 },
        ]),
        'Sample2': samples(() => [
          { x: 3, y: 3, result: 6 },
          { x: 7, y: 7, result: 14 },
        ]),
        'Given a input': given((ctx) => ({
          x: ctx.sample.x,
          y: ctx.sample.y,
        })),
        'When running': when((ctx) => {
          ctx.ret = ctx.x + ctx.y
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.ret === ctx.sample.result)
        }),
      })
    }

    it('should run', async () => {
      //given
      const factory = givenTheScenarioWithSamples()
      const instance = factory.create('A scenario')

      //when
      const ret = await instance.run()

      //then
      // - firts, it should not throw a exception, then:
      assert.ok(ret, state.passed)
      assert.strictEqual(instance.samples.length, 2)
      assert.strictEqual(instance.samples[0].state, state.done)
      for (const s of [0, 1]) {
        assert.strictEqual(instance.samples[s].description, `Sample${s + 1}`)
        for (const sc of [0, 1]) {
          assert.strictEqual(instance.samples[s].execution.scenarios[sc].stage, 'check')
          assert.strictEqual(instance.samples[s].execution.scenarios[sc].state, state.passed)
          assert.strictEqual(instance.samples[s].execution.scenarios[sc].givens[0].state, state.done)
          assert.strictEqual(instance.samples[s].execution.scenarios[sc].whens[0].state, state.done)
          assert.strictEqual(instance.samples[s].execution.scenarios[sc].checks[0].state, state.passed)
        }
      }
    })

  })
})
