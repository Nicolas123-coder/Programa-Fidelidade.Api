const { samples } = require('../src/samples.js')
const { state } = require('../src/runningState.js')
const assert = require('assert')

describe('A samples value', () => {
    context('before run', () => {
        const givenAGenericSamples = () => {
            const instance = samples({
                id: 1,
            })
            return instance
        }

        it('should validate its structure')

        it('should document its structure', async () => {
            //given
            const factory = givenAGenericSamples()
            const instance = factory.create('A "Samples" description')

            //when
            const ret = await instance.doc()

            //then
            assert.deepStrictEqual(
                ret,
                { type: 'samples', description: 'A "Samples" description', value: { id: 1 }, isFunction: false },
            )
        })
    })

    const sampleSamples = [
        {
            description: 'as object',
            givenSample: () => {
                return samples({
                    x1: 'Given a sample object',
                })
            }
        },
        {
            description: 'as function',
            givenSample: () => {
                return samples(() => ({
                    x1: 'Given a sample object',
                }))
            }
        },
    ]

    sampleSamples.forEach((s) =>
        context(s.description, () => {
            context('passing', () => {
                const givenAObjectSamples = () => {
                    return samples([{
                        x1: 'Given a sample object',
                    }])
                }

                it('should return its value', async () => {
                    //given
                    const factory = givenAObjectSamples()
                    const instance = factory.create('')
                    const context = {}
                    //when
                    const ret = await instance.run(context)

                    //then
                    assert.strictEqual(instance.state, state.done)
                    assert.deepStrictEqual(instance.value, [{ x1: 'Given a sample object' }])
                })

                it('should audit after run', async () => {
                    //given
                    const factory = givenAObjectSamples()
                    const instance = factory.create('')
                    const context = {}

                    //when
                    const ret = await instance.run(context)

                    //then
                    assert.deepStrictEqual(instance.auditTrail, { type: 'samples', state: 'done', description: '' })
                })
            })

            it('failing')

        }))
})
