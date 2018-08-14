const router = require('koa-router')()
const fetch = require('node-fetch')
const querystring = require('querystring')

router.prefix('/api')

function getToken(code) {
  const client_id = 'a3144def15f37b5cdf23' // 你的 client_id
  const client_secret = '830c6e28a14dd5c355876731f51512f53cf49389' // 你的 client_secret

  return new Promise(resolve => {
    const params = {
      code, client_id, client_secret
    }

    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => {
      resolve(res.text())
    })
    .catch(e => {
      console.log(e);
    })
  })
}

function getUserinfo(token) {
  return new Promise(resolve => {
    // fetch('https://api.github.com/user?access_token=' + token, {
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token
      }
    })
    .then(res => {
      resolve(res.text())
    })
    .catch(e => {
      console.log(e)
    })
  })
}

router.post('/sendbackCode', async (ctx, next) => {
  const code = ctx.request.body.code 
  const client_id = ctx.request.body.client_id
  const client_secret = ctx.request.body.client_secret
  const querystr = await getToken(code)
  const token = querystring.parse(querystr).access_token
  ctx.body = {status: 0, data: token}
})

router.get('/getUserinfo', async (ctx, next) => {
  const token = ctx.query.token
  const res = await getUserinfo(token)
  ctx.body = {status: 0, data: JSON.parse(res)}
})

module.exports = router