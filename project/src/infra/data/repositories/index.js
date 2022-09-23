async function factory(conn) {
    return {
    userRepository: await new (require('./userRepository.js'))(conn)
}
}
module.exports = factory