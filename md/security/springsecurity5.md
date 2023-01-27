### SpringSecurity + JWT 
使用场景：分布式系统中单点登录 `SSO`

### 一、SSO
#### 1. 概念说明
* 分布式系统中，用户只要登录一次，就可以访问其他的子系统
* 分布式系统中，每台服务器都有独立的 `session` ，因此 `session` 无法直接共享资源，
所以通常不会使用 `session` 作为单点登录的技术方案
 
#### 2. 实现方案
* 用户认证：客户端发起认证请求，认证通过后，返回给客户端一个成功的令牌 `token`
* 身份校验：客户端携带 `token` 访问其他服务器时，服务器对 `token` 的真伪进行校验

#### 3. JWT
* `JWT`，全称`JSON Web Token`，官网：`https://jwt.io`，是一种 `token` 生成、解析方案
* `JWT` 生成的token由三部分组成
    * 头部 `HEADER` ：规定算法、类型
    * 载荷 `PAYLOAD`：有效数据的部分，比如用户名、角色、过期时间等
    * 签名 `SIGNATURE`：将头部与载荷base64编码，用`.`相连，再加入盐，最后使用头部声明的算法进行编码，就得到了签名
   
```
HEADER:ALGORITHM & TOKEN TYPE
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD:DATA
{
  "name": "fgq",
  "tel": "18200000000"
}

VERIFY SIGNATURE
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  your-256-bit-secret
) 
``` 


### 二、实现
#### 1. 重写逻辑
* 认证逻辑：`UsernamePasswordAuthenticationFilter.attemptAuthentication() `
* 认证成功逻辑：`AbstractAuthenticationProcessingFilter.successfulAuthentication()`
