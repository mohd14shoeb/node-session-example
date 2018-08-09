const Koa = require('koa')
const session = require('koa-session')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const xtpl = require('xtpl/lib/koa2')

const app = new Koa()
const router = new Router()

xtpl(app, {
  views: './views',
})

app.keys = ['some secret hurr']

const CONFIG = {
  key: 'koa:sess', // (string) cookie key
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true,
  rolling: false,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
}

app.use(session(CONFIG, app))

router.get('/', async (ctx, next) => {
  if (ctx.session.userName == null) {
    ctx.redirect('/login')
  } else {
    ctx.body = await ctx.render('index')
  }
})

router.get('/login', async (ctx, next) => {
  ctx.session = null
  ctx.body = await ctx.render('login', { message: 'login please!' })
})

router.post('/login', async (ctx, next) => {
  const { name, password } = ctx.request.body
  console.log(ctx.request.body)

  // check name/password
  if (name === 'jiang' && password === 'jiang') {
    ctx.session.userName = name
    ctx.redirect('/')
  } else {
    ctx.body = await ctx.render('login', {
      message: 'name or password is wrong.',
    })
  }
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
console.log('open: http://localhost:3000')
