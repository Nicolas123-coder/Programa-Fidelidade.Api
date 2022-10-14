async function factory(conn) {
    return {
    usuarioRepository: await new (require('./usuarioRepository.js'))(conn),
    estabelecimentoRepository: await new (require('./estabelecimentoRepository.js'))(conn),
    programaRepository : await new (require('./programaRepository.js'))(conn)
}
}
module.exports = factory