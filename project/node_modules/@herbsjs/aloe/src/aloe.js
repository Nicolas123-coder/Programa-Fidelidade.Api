const { spec } = require('./spec')
const { scenario } = require('./scenario')
const { given } = require('./given')
const { when } = require('./when')
const { check } = require('./check')
const { samples } = require('./samples')
const { state } = require('./runningState')

module.exports = {
    spec,
    scenario,
    given,
    when,
    check,
    samples,
    state
}