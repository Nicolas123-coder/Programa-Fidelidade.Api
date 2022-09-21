const { spec } = require('../src/spec')
const { usecase, step, Ok, Err } = require('@herbsjs/buchu')

const assert = require('assert')
const { scenario } = require('../src/scenario')
const { given } = require('../src/given')
const { when } = require('../src/when')
const { check } = require('../src/check')
const { state } = require('../src/runningState')

describe('A spec', () => {
  context('generic', () => {
    context('before run', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              id: 'a',
            })),
            'When running': when((ctx) => {
              ctx.id = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.id === 'b')
            }),
          }),
        })

        return ASpec
      }

      it('should validate its structure')

      it('should document its structure', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()

        //when
        const ret = await instance.doc()

        //then
        assert.deepStrictEqual(
          ret,
          {
            type: 'spec',
            scenarios: [
              {
                type: 'scenario',
                description: 'A simple scenario',
                info: 'A simple scenario',
                samples: [],
                givens: [{ type: 'given', description: 'Given a input', value: { id: 'a' }, isFunction: true }],
                whens: [{ type: 'when', description: 'When running' }],
                checks: [{ type: 'check', description: 'Check another output' }]
              }]
          },
        )
      })
    })

    context('passing', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              id: 'a',
            })),
            'When running': when((ctx) => {
              ctx.id = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.id === 'b')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.passed)
        assert.strictEqual(
          instance.scenarios[0].description,
          'A simple scenario',
        )
        assert.strictEqual(instance.scenarios[0].state, state.passed)
      })

      it('should audit after run')
    })

    context('failing', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              user: 'a',
            })),
            'When running': when((ctx) => {
              ctx.user = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.user === 'c')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.ok(instance.scenarios[0].usecase === undefined)
        assert.strictEqual(instance.scenarios[0].state, state.failed)
      })

      it('should audit after run')
    })
  })
  context('for use case', () => {
    context('before run', () => {
      const givenTheSimplestUCSpec = () => {
        const AUseCase = (injection) =>
          usecase('A generic use case', {})

        const ASpec = spec({
          usecase: AUseCase,
          'A simple scenario': scenario({
            'Given a input': given({ id: "a" }),

            // when: default when for use case

            'Check another output': check((ctx) => {
              assert.ok(ctx.response.value.id === 'a')
              assert.ok(ctx.response.value.customer === 1)
            }),
          }),
        })
        return ASpec
      }

      it('should validate its structure')

      it('should document its structure', async () => {
        //given
        const instance = givenTheSimplestUCSpec()

        //when
        const ret = await instance.doc()

        //then
        assert.deepStrictEqual(
          ret,
          {
            type: 'spec',
            usecase: { type: 'use case', description: 'A generic use case', steps: [] },
            scenarios: [
              {
                type: 'scenario',
                description: 'A simple scenario',
                info: undefined,
                samples: [],
                givens: [{ type: 'given', description: 'Given a input', value: { id: 'a' }, isFunction: false }],
                whens: [],
                checks: [{ type: 'check', description: 'Check another output' }]
              }]
          },
        )
      })
    })

    context('passing', () => {
      const givenTheSimplestUCSpec = () => {
        const AUseCase = (injection) =>
          usecase('A generic use case', {
            request: { id: String },
            authorize: async (user) => (user.can ? Ok() : Err()),
            'A step 1': step((ctx) => {
              ctx.customer = injection.customer
              return Ok()
            }),
            'A step 2': step((ctx) => {
              ctx.ret = { id: ctx.req.id, customer: ctx.customer }
              return Ok()
            }),
          })

        const ASpec = spec({
          usecase: AUseCase,
          'A simple scenario': scenario({
            'Given a input': given({
              request: { id: 'a' },
              user: { can: true },
              injection: { customer: 1 },
            }),

            // when: default when for use case

            'Check another output': check((ctx) => {
              assert.ok(ctx.response.value.id === 'a')
              assert.ok(ctx.response.value.customer === 1)
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestUCSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.passed)
        assert.strictEqual(instance.usecase.name, 'AUseCase')
        assert.strictEqual(
          instance.scenarios[0].description,
          'A simple scenario',
        )
        assert.ok(instance.scenarios[0].usecase !== undefined)
        assert.strictEqual(instance.scenarios[0].state, state.passed)
      })

      it('should audit after run')
    })

    context('failing', () => {
      const givenTheSimplestUCSpec = () => {
        const AUseCase = (injection) =>
          usecase('A generic use case', {
            request: { user: String },
            authorize: async (user) => (user.can ? Ok() : Err()),
            'A step 1': step((ctx) => {
              ctx.customer = injection.customer
              return Ok()
            }),
            'A step 2': step((ctx) => {
              ctx.ret = { id: ctx.req.id, customer: ctx.customer }
              return Ok()
            }),
          })

        const ASpec = spec({
          usecase: AUseCase,
          'A simple scenario': scenario({
            'Given a input': given({
              request: { id: 'a' },
              user: { can: true },
              injection: { customer: 1 },
            }),

            // when: default when for use case

            'Check another output': check((ctx) => {
              assert.ok(ctx.response.value.id === 1)
              assert.ok(ctx.response.value.customer === 'a')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestUCSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.strictEqual(instance.scenarios[0].state, state.failed)
      })

      it('should audit after run')
    })
  })

  it('for an entity')
})
