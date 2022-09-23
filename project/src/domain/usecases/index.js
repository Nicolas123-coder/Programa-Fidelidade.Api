module.exports = [
    { usecase: require('./user/createUser'), tags: { group: 'Users', type: 'create'} },
    { usecase: require('./user/updateUser'), tags: { group: 'Users', type: 'update'} },
    { usecase: require('./user/deleteUser'), tags: { group: 'Users', type: 'delete'} },
    { usecase: require('./user/findAllUser'), tags: { group: 'Users', type: 'read'} },
    { usecase: require('./user/findUser'), tags: { group: 'Users', type: 'read'} }
]