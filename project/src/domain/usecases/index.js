module.exports = [
    { usecase: require('./usuario/criaUsuario'), tags: { group: 'Usuario', type: 'create'} },
    { usecase: require('./estabelecimento/criaEstabelecimento'), tags: { group: 'Estabelecimento', type: 'create'} },
    { usecase: require('./estabelecimento/criaProgramaFidelidade'), tags: { group: 'Estabelecimento', type: 'create'} },

    { usecase: require('./user/updateUser'), tags: { group: 'Users', type: 'update'} },
    { usecase: require('./user/deleteUser'), tags: { group: 'Users', type: 'delete'} },
    { usecase: require('./user/findAllUser'), tags: { group: 'Users', type: 'read'} },
    { usecase: require('./user/findUser'), tags: { group: 'Users', type: 'read'} }
]