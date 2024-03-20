### OAuth2 相关概念
### 一、概念
#### 1. OAuth、OAuth2
* `OAuth（Open Authorization）`是一种协议，用于提供认证、授权的规范
* `OAuth2.0` 是`OAuth1.0` 协议的延续版本，但不向兼容 `OAuth1.0`
* 官网：[https://oauth.net/2/](https://oauth.net/2/)
   
#### 2. OAuth2 协议中的角色
* `Client`（客户端）：访问资源的客户端，会使用访问令牌去获取资源服务器的资源，可以是浏览器、移动设备或者服务器等

* `Resource owner`（资源拥有者）：即用户，拥有该资源的最终用户，拥有访问资源的账号密码

* `Resource server`（资源服务器）：拥有受保护资源的服务器，如果请求包含正确的访问令牌，则可以访问该资源服务器

* `Authorization server`（认证服务器）：用于认证用户的服务器，如果客户端认证通过，发放访问资源服务器的令牌


#### 3. OAuth2 运行流程
![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2.png)
* 客户端要求用户给予授权
* 用户同意给予客户端授权
* 客户端使用上一步获得的授权，向认证服务器申请令牌
* 认证服务器对客户端进行认证以后，确认无误，同意发放令牌
* 客户端使用令牌，向资源服务器申请获取资源
* 资源服务器确认令牌无误，同意向客户端开放资源



### 二、OAuth2 四种授权模式
#### 1. 授权码模式 Authorization Code
![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2_1.png)

* A 用户访问客户端，后者将前者导向认证服务器
* B 用户选择是否给予客户端授权
* C 同意授权，认证服务器将用户导向客户端事先指定的"重定向URI"（redirection URI），同时附上一个授权码
* D 客户端收到授权码，附上"重定向URI"，向认证服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见
* E 认证服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌`access token`和更新令牌`refresh token`
  
    
#### 2. 简化模式 Implicit
简化模式不通过第三方应用程序的服务器，直接在浏览器中向认证服务器申请令牌，
跳过了"授权码"这个步骤，所有步骤在浏览器中完成，令牌对访问者是可见的，且客户端不需要认证

![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2_2.png)

* A 客户端将用户导向认证服务器
* B 用户决定是否给于客户端授权
* C 假设用户给予授权，认证服务器将用户导向客户端指定的"重定向URI"，并在URI的Hash部分包含了访问令牌
* D 浏览器向资源服务器发出请求，其中不包括上一步收到的Hash值
* E 资源服务器返回一个网页，其中包含的代码可以获取Hash值中的令牌
* F 浏览器执行上一步获得的脚本，提取出令牌
* G 浏览器将令牌发给客户端




#### 3. 密码模式 Resource Owner Password Credentials
* 用户向客户端提供自己的用户名、密码，客户端使用这些信息，向认证服务器请求授权
* 整个过程中，客户端不得保存用户的密码

![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2_3.png)

* A 用户向客户端提供用户名和密码
* B 客户端将用户名和密码发给认证服务器，向后者请求令牌
* C 认证服务器确认无误后，向客户端提供访问令牌





#### 4. 客户端模式 Client Credentials
客户端以自己的名义，而不是以用户的名义，向"认证服务器"进行认证

![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2_4.png)

* A 客户端向认证服务器进行身份认证，并要求一个访问令牌。
* B 认证服务器确认无误后，向客户端提供访问令牌
 
