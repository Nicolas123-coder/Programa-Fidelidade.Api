const { state } = require("./runningState")

class When {
  constructor(description, func) {
    this.type = 'when'
    this.func = func
    this.builtin = false
    this.state = state.ready
    this.description = description
    this._auditTrail = { type: this.type, state: this.state, description: this.description }
  }

  async run(context) {
    let run = state.ready
    try {
      await this.func(context)
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
    if (this.builtin) return
    const doc = {
      type: this.type,
      description: this.description
    }
    return doc
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    if (this.error) audit.error = this.error
    return audit
  }

  get isWhen() {
    return true
  }
}

const when = (body) => ({
  create: (description) => { return new When(description, body) }
})

module.exports = { when }
