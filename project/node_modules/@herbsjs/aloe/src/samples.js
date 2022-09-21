const { exec } = require("./exec")
const { state } = require("./runningState")

class Samples {
  constructor(description, body) {
    this.type = 'samples'
    this.state = state.ready
    this.description = description
    this._auditTrail = { type: this.type, state: this.state, description: this.description }
    this._body = body
    if (typeof body === 'function') {
      this.func = body
    }
  }

  async run() {
    let run = state.ready
    try {
      const ret = this.func ? await this.func() : this._body
      if (!Array.isArray(ret)) throw new Error('Samples return must be a array')
      this.value = ret
      run = state.done
    } catch (error) {
      run = state.failed
      this.error = error
    }
    this.state = run
    this._auditTrail.state = run
    return run
  }

  doc() {
    const doc = {
      type: this.type,
      description: this.description,
      value: exec.safe(this._body),
      isFunction: exec.isFunction(this._body)
    }
    return doc
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    if (this.error) audit.error = this.error
    audit.description = this.description
    return audit
  }

  get isSamples() {
    return true
  }

}

const samples = (body) => ({
  create: (description) => { return new Samples(description, body) }
})

module.exports = { samples }
