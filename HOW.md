# HOW

为了理解并使用 GitHub OAuth 写的一个小 demo（模版来自 [koa-generator](https://github.com/17koa/koa-generator)）

关于 GitHub OAuth，详细可以看 [这里](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)

首先需要注册一个新的 OAuth 应用（[链接](https://github.com/settings/applications/new)）。另外，在 [这里](https://github.com/settings/applications) 你可以看到你用 GitHub 授权登录的第三方应用列表

填写好信息注册完后，可以获得 **Client ID** 和 **Client Secret**，后者不对外。填写信息的时候注意下 **Authorization callback URL**，是授权完后的回调地址，授权完后会重定向到这个地址（所以这个地址你必须可控），并且在 url 上会自动带上一个 code 参数（之后需要将其发送到 GitHub 服务器换取 token）

继续以这个 demo 为例，获取授权的 url 是 <https://github.com/login/oauth/authorize?client_id=a3144def15f37b5cdf23>，然后点击确认授权后，会跳转到 <http://localhost:3000/cb?code=9ead5bf0fa9f68c6092b>，即我们设置的 callback url，如果之前已经授权过了，会自动跳转。然后将 code、client_id、client_secret 参数 post 到这个接口 https://github.com/login/oauth/access_token 换取 token（demo 中接口 /api/sendbackCode），根据这个 token 就可以获取用户 GitHub 中的其他信息了

demo 中有两个对 GitHub 服务器的请求，一个是用 code 换取 token，另外一个是利用 token 获取信息，这两个接口存在跨域，所以用了服务器去请求。实际上 demo 可以更简单，用 [这个跨域神器](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)，就不需要后端了

另外需要注意下：

- token 会过期（demo 中简单根据返回做了判断，如果判断过期，则删除本地保存的 token，页面重载）
- demo 中后端 HTTP 请求用了 node-fetch，之前是想用 axios，但是一直报错，不知原因 ~~（我简单查了下，可能是用 axios 在 http 环境下对 https 的请求会有 bug，如果是这样的话，应该是 axios 的 bug）~~ 直到找到 [这个 issue](https://github.com/axios/axios/issues/662#issuecomment-275085073) 我突然想起我的 `.zshrc` 中也有类似配置，注释掉就好了，又可以愉快的使用 axios 了
- 具体 OAuth 的实现细节与 demo 肯定有出入，比如 token 的存取（可能不是直接把 access_token 存在本地），回调 url 的设置等