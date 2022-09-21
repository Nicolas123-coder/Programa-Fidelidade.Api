[![CD Build](https://github.com/herbsjs/aloe/actions/workflows/cd.yml/badge.svg)](https://github.com/herbsjs/aloe/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/herbsjs/aloe/branch/main/graph/badge.svg)](https://codecov.io/gh/herbsjs/aloe)
[![stability-beta](https://img.shields.io/badge/stability-beta-33bbff.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#beta)

# Aloe

Scenario description and test runner for Herbs

### Installing

```$ npm install @herbsjs/aloe```

### Using

```javascript
const { spec, scenario, given, check, samples } = require('@herbsjs/aloe')

const taskCountSpec = spec({
    'Change count for the task': scenario({
        'Given a valid task': given({ task: 'do it', count: 0 }),
        'When increase count': when((ctx) => (ctx.count++)),
        'Must have a increased count': check((ctx) => { assert.ok(ctx.count === 1) }),
    }),
})
```

## How to use

### Basic Spec

A `spec` represents the primary structure where the scenarios will be placed. It can have one or several scenarios:

```javascript
const updateUserSpec = spec({
    'Update valid User': scenario({ ... }),
    'Do not update invalid User': scenario({ ... }),
})
```

A `scenario` represents a context with input (`given`), action (`when`) and the output validation (`check`). 

```javascript
const taskCountSpec = spec({
    'Change count for the task': scenario({
        'Given a valid task': given({ task: 'do it', count: 0 }),
        'When increase count': when((ctx) => (ctx.count++)),
        'Must have a increased count': check((ctx) => { assert.ok(ctx.count === 1) }),
    }),
})
```

It is possible to have many `given` and `check` on the same scenario.

```javascript
const billingSpec = spec({
    'Calculate a valid bill': scenario({
        'Given valid items': given({ ... }),
        'Given a discount': given(async () => { ... }),
        'When calculate the bill': when((ctx) => ...),
        'Must have a valid bill': check((ctx) => ...),
        'Must have a discount': check((ctx) => ...),
    }),
})
```

### Use Case Spec

When informed a use case the spec will assume all the scenarios are about this use case.

This will change the behavior of each scenario since it will not necessary to declare a `when`. 

In order to run, the scenario expects a `given` returning a object with `request`, `user` (for use case authentication) and `injection`. 

The result of the use case execution is stored in `ctx.response`.

```javascript
const updateUser = require('./updateUser')

const updateUserSpec = spec({

    usecase: updateUser, 
    
    'Update a existing user when it is valid': scenario({
        'Given a valid user': given({
            request: { id: 1 },
            user: { can: true },
            injection: { userRepo: ... },
        }),
        // when: default for use case
        'Must run without errors': check((ctx) => { assert.ok(ctx.response.isOk) }),
        'Must confirm update': check((ctx) => { assert.ok(ctx.response.ok === true) })
    }),
})
```

### Samples

If instead of validating the scenario with just one input you want to validate the set of inputs it is possible to use `samples`.

```javascript
const updateProjectSpec = spec({

    usecase: updateProject,
    
    'Update a existing project': scenario({
        'Projects with due dates': samples([
            { duedate: ... },               // item 1
            { duedate: ... },               // item 2
        ]),
        'Projects with tasks': samples([
            { tasks: [] },                  // item 1
            { tasks: [{ task: ... }] },     // item 2
        ]),
        'Given a valid project': given((ctx) => ({
            request: ctx.sample,  // each item in `samples()`
            ...
        })),
        'Given a repository with a existing project': given((ctx) => ... ),
        'Must run without errors': check((ctx) => ... ),
        'Must confirm update': check((ctx) => ... )
    })
}),
```

In the above scenario `'Update a existing project'` it will run four times, one for each item in each `samples`. The content of each run is available on `ctx.sample`.

### Context

The context is created by `samples` or `givens`.

```javascript
const updateUserSpec = spec({

    'Update a existing user': scenario({
        'Given a valid user': given({ name: 'Claudia' }),
        'Print user name': check((ctx) => { console.log(ctx.name) }),
        ...
```

Or

```javascript
const updateUserSpec = spec({

    'Update a existing user': scenario({
        'Valid users': samples([
            { name: 'Claudia' },               // item 1
            { name: 'Claudio' },               // item 2
        ]),
        'Given a valid user': given((ctx) => ctx.sample),
        'Print user name': check((ctx) => { console.log(ctx.name) }),
        ...
```

### Assertion

To validate a scenario it is necessary to go through checks with its assertions. If an assertion throws an exception, it is understood that that check failed.

It is possible to use any assertion library, including native node.js [assertion](https://nodejs.org/api/assert.html#assert).

```javascript
const createUserSpec = spec({

    usecase: createUser, 
    
    'Create a new user': scenario({
        'Given a valid user': given(...),
        'Must run without errors': check((ctx) => { 
            assert.ok(ctx.response.isOk) 
        }),
        'Must return the created user': check((ctx) => { 
            assert.ok(ctx.response.ok === aGivenUser()) 
        })
    }),
})
```


## TODO
- [ ] doc on web site
- [ ] CLI: doc `spec` command
- [ ] skip
- [ ] only
- [ ] todo / pending
- [ ] nested scenarios
- [ ] process exit code = 1 when error
- [ ] TAP protocol https://testanything.org/


### Contribute

Come with us to make an awesome *Aloe*.

Now, if you do not have technical knowledge and also have intend to help us, do not feel shy, [click here](https://github.com/herbsjs/aloe/issues) to open an issue and collaborate their ideas, the contribution may be a criticism or a compliment (why not?)

If you would like to help contribute to this repository, please see [CONTRIBUTING](https://github.com/herbsjs/aloe/blob/master/.github/CONTRIBUTING.md)

### The Herb

The gel inside of the leaves of the Aloe plant can be used externally to treat minor burns, sun burn, cuts, scrapes and poison ivy. Aloe gel is good for moisturizing the skin and is a main ingredient of many skin care products.

https://www.herbslist.net/

https://en.wikipedia.org/wiki/Aloe_vera

### License

**Aloe** is released under the
[MIT license](https://github.com/herbsjs/aloe/blob/master/LICENSE.md).
