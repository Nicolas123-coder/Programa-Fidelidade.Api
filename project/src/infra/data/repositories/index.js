async function factory(conn) {
    return {
    usuarioRepository: await new (require('./usuarioRepository.js'))(conn),
    estabelecimentoRepository: await new (require('./estabelecimentoRepository.js'))(conn),
}
}
module.exports = factory