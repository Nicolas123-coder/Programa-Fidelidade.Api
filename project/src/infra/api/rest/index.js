const cors = require('cors')
const express = require('express')
const { json } = require('body-parser')
const camelCase = require('lodash.camelcase')
const db = require('../../../infra/data/database')
const usecases = require('../../../domain/usecases')
const renderShelfHTML = require('@herbsjs/herbsshelf')
const { generateRoutes } = require('@herbsjs/herbs2rest')
const repositoriesFactory = require('../../../infra/data/repositories')
const CriaUsuario = require('../../../domain/usecases/usuario/criaUsuario')
const CriaEstabelecimento = require('../../../domain/usecases/estabelecimento/criaEstabelecimento')
const CriaPrograma = require('../../../domain/usecases/estabelecimento/criaProgramaFidelidade')
const Autenticacao = require('../../../domain/usecases/login')
const { response } = require('express')

function cloneUsecases (usecases) {
    return Promise.all(usecases.map(uc => {
        const clonedUC = { ...uc }
        clonedUC.usecase = clonedUC.usecase({})()
        return clonedUC
    }))
}

const newRoute = (usecase, useId) => {
    const route = { usecase }
    if (useId) route.id = 'id'
    return route
}
const mapUcToHTTPVerb = {
    create: {
        route: 'post',
        useId: false
    },
    update: {
        route: 'put',
        useId: false
    },
    delete: {
        route: 'delete',
        useId: false
    },
    find: {
        route: 'getById',
        useId: false
    },
    findAll: {
        route: 'getAll',
        useId: false
    }
}

let repositories

async function prepareRoutes (config) {
    const conn = await db.factory(config)
    repositories = await repositoriesFactory(conn)

    // groupBy group
    const ucByGroup = usecases.reduce((acc, obj) => {
        if (Object.keys(acc).includes(obj.tags.group)) return acc
        acc[obj.tags.group] = usecases.filter(x => x.tags.group === obj.tags.group)
        return acc
    }, {})

    const routes = Object.keys(ucByGroup).map(group => {
        const route = {
            name: `${camelCase(group)}`
        }
        for (const obj of ucByGroup[group]) {
            const uc = obj.usecase(repositories)
            const ucDescription = uc().description.toLowerCase()

            for (const ucType of Object.keys(mapUcToHTTPVerb))
                if (ucDescription.includes(ucType))
                    route[mapUcToHTTPVerb[ucType].route] = newRoute(uc, mapUcToHTTPVerb[ucType].useId)
        }
        return route
    })

    return Promise.all(routes)
}

module.exports = async (app, config) => {
    app.use(json({ limit: '50mb' }))
    app.use(cors())

    const router = new express.Router()

    const verbose = !config.isProd
    const routes = await prepareRoutes(config)
    generateRoutes(routes, router, verbose)

    //CRIAÇÃO DAS ROTAS

    router.post('/login', async (req, res) => {
        try {
            const ucAutenticacao = Autenticacao({
                usuarioRepository: repositories.usuarioRepository,
                estabelecimentoRepository: repositories.estabelecimentoRepository
            }) ()

            await ucAutenticacao.authorize()

            const retorno = await ucAutenticacao.run(req.body)

            if(retorno.isErr) {
                return res.status(400).json(retorno.err)
            }

            return res.json(retorno)
        } catch (error) {
            return res.status(500).json({ message: "Falha na autenticação" })
        }
    })

    router.post('/usuario/create', async (req,res) => {
        try {
            const ucCriaUsuario = CriaUsuario({
            usuarioRepository: repositories.usuarioRepository
            }) ()

            await ucCriaUsuario.authorize()
            const retorno = await ucCriaUsuario.run(req.body)

            if(retorno.isErr) {
                return res.status(400).json(retorno.err)
            }

            return res.json(retorno)
        } catch (error) {
            return res.status(500).json({ message: "Falha ao salvar usuário" })
        }
    })

    router.post('/estabelecimento/create', async (req,res) => {
        try {
            const ucCriaEstabelecimento = CriaEstabelecimento({
            estabelecimentoRepository: repositories.estabelecimentoRepository
            }) ()

            await ucCriaEstabelecimento.authorize()
            const retorno = await ucCriaEstabelecimento.run(req.body)

            if(retorno.isErr) {
                return res.status(400).json(retorno.err)
            }

            return res.json(retorno)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Falha ao salvar estabelecimento", erro: error })
        }
    })

    router.post('/estabelecimento/createProgramaFidelidade', async (req,res) => {
        try {
            const ucCriaPrograma = CriaPrograma({
                programaRepository: repositories.programaRepository
            }) ()

            await ucCriaPrograma.authorize()
            const retorno = await ucCriaPrograma.run(req.body)

            if(retorno.isErr) {
                return res.status(400).json(retorno.err)
            }

            return res.json(retorno)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Falha ao salvar programa de fidelidade" })
        }
    })


    app.use(router)

    const ucs = await cloneUsecases(usecases)

    app.get('/herbsshelf', (_, res) => {
        res.setHeader('Content-Type', 'text/html')
        const shelf = renderShelfHTML('Project generated by Herbs-CLI', ucs)
        res.write(shelf)
        res.end()
    })
}