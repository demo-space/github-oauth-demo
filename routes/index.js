const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {})
})

router.get('/cb', async (ctx, next) => {
  await ctx.render('cb', {})
})

module.exports = router
