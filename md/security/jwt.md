### JWT
#### 1. 概念
`JWT`，全称`JSON Web Token`，官网：`https://jwt.io`，是一种 `token` 生成、解析方案

#### 2. 组成
`JWT` 生成的`token`由三部分组成
* 头部 `HEADER` ：规定算法、类型
* 载荷 `PAYLOAD`：有效数据的部分，比如用户名、角色、过期时间等
* 签名 `SIGNATURE`：将头部与载荷进行`base64`编码，用`.`相连，再加入盐secret，
最后使用头部声明的算法进行编码，就得到了`token`
   
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
