function isFunction(value) {
    return typeof value === 'function'
}

function exec(value) {
    if (isFunction(value))
        return value()
    else
        return value
}

function safe(value) {
    try {
        return exec(value)
    } catch (error) {
        return 
    }
}

exec.isFunction = isFunction
exec.safe = safe

module.exports.exec = exec