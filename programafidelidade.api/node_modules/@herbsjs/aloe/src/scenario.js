const { builtinWhen } = require('./builtin/when')
const { samples } = require('./samples')
const { state } = require('./runningState')

const stages = {
  none: 'none',
  samples: 'samples',
  given: 'given',
  when: 'when',
  check: 'check'
}

const addBuiltinWhen = (scenario) => {
  if (!scenario.usecase) return
  if (scenario.whens.length > 0) return
  const when = builtinWhen()
  scenario.whens.push(when)
}

class ScenarioWithSample {
  constructor(scenario, sample) {
    this.scenario = scenario
    this.sample = sample
    this.stage = stages.none
    this._auditTrail = { sample, stage: this.stages }
  }

  async run() {

    const exec = async (list, stages, context) => {
      for (const item of list) {
        await item.run(context)
      }
      this.state = list.find((check) => check.state === state.failed) ? state.failed : state.passed
      this._auditTrail.state = this.state
      this.stage = stages
      return this.state
    }

    this.build()
    this.context = { sample: this.sample, usecase: this.usecase }

    let ret
    ret = await exec(this.givens, stages.given, this.context)
    if (ret === state.failed) return ret

    ret = await exec(this.whens, stages.when, this.context)
    if (ret === state.failed) return ret

    ret = await exec(this.checks, stages.check, this.context)
    if (ret === state.failed) return ret
  }

  build() {

    const clone = (scenario) => {
      this.usecase = scenario.usecase
      this.info = scenario.info
      this.body = scenario._body
    }

    clone(this.scenario)
    const entries = Object.entries(this.body)
    const intialized = entries.map(([k, v]) => v.create ? v.create(k) : {})
    this.givens = intialized.filter(g => g.isGiven)
    this.whens = intialized.filter(w => w.isWhen)
    this.checks = intialized.filter(c => c.isCheck)

    addBuiltinWhen(this)

  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    audit.stage = this.stage
    audit.givens = this.givens.map(givens => givens.auditTrail)
    audit.whens = this.whens.map(whens => whens.auditTrail)
    audit.checks = this.checks.map(checks => checks.auditTrail)
    return audit
  }
}

class SamplesExecution {
  constructor(scenario, samples) {
    this.scenario = scenario
    this.samples = samples
    this.scenarios = []
    this._auditTrail = { builtin: this.samples.builtin }
  }

  async run() {
    const samples = this.samples
    const ret = await samples.run()
    if (ret === state.failed) return ret

    const scenarioWithSample = this.scenarios
    for (const sample of samples.value) {
      const instance = new ScenarioWithSample(this.scenario, sample)
      scenarioWithSample.push(instance)
      const ret = await instance.run()
    }

    this.state = scenarioWithSample.find((ss) => ss.state === state.failed) ? state.failed : state.passed
    return this.state
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    audit.executions = this.scenarios.map(scenarios => scenarios.auditTrail)
    return audit
  }

}


class Scenario {
  constructor(description, body) {
    this.type = 'scenario'
    this.state = state.ready
    this.description = description
    this._auditTrail = { type: this.type, state: this.state, description: this.description }
    this._body = body
  }

  async run() {

    const addBuiltinSample = () => {
      if (this.samples.length > 0) return
      const factory = samples([{}])
      const instance = factory.create('')
      instance.builtin = true
      this.samples.push(instance)
    }

    this.info = this._body.info
    const entries = Object.entries(this._body)
    const intialized = entries.map(([k, v]) => v.create ? v.create(k) : {})
    this.samples = intialized.filter(s => s.isSamples)
    addBuiltinSample()

    for (const samples of this.samples) {
      const execution = new SamplesExecution(this, samples)
      samples.execution = execution
      const ret = await execution.run()
    }
    const run = this.samples.find((sc) => sc.execution.state === state.failed) ? state.failed : state.passed
    this.state = run
    this._auditTrail.state = run
    return run
  }

  doc() {
    const build = () => {
      this.info = this._body.info
      const entries = Object.entries(this._body)
      const intialized = entries.map(([k, v]) => v.create ? v.create(k) : {})

      this.samples = intialized.filter(s => s.isSamples)
      this.givens = intialized.filter(g => g.isGiven)
      this.whens = intialized.filter(w => w.isWhen)
      this.checks = intialized.filter(c => c.isCheck)
      addBuiltinWhen(this)
    }

    build()
    const doc = {
      type: this.type,
      description: this.description,
      info: this.info,
      samples: this.samples.map(sample => sample.doc()),
      givens: this.givens.map(given => given.doc()),
      whens: this.whens.map(when => when.doc()).filter(Boolean),
      checks: this.checks.map(check => check.doc())
    }
    return doc
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    audit.samples = this.samples.map(s => s.execution.auditTrail)
    return audit
  }

  get isScenario() {
    return true
  }
}

const scenario = (body) => ({
  create: (description) => { return new Scenario(description, body) }
})

module.exports = { scenario }
