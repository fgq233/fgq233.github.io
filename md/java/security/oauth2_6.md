### OAuth2 端点接口
* /oauth/authorize
* /oauth/token
* /oauth/confirm_access
* /oauth/error
* /oauth/check_token
* /oauth/token_key

### 一、默认端点接口 
#### 1. 授权端点 AuthorizationEndpoint
该端点用于<u>获取授权码</u>，请求地址：**/oauth/authorize**，需要下列参数
* 客户端id（必选）：client_id
* response_type（必选）：授权码模式的值固定为code，简化模式的值固定为token
* 客户端状态（可选）：state
* 重定向uri（可选）：redirect_uri

```java
@FrameworkEndpoint
public class AuthorizationEndpoint extends AbstractEndpoint {
	
	private String userApprovalPage = "forward:/oauth/confirm_access";
	private String errorPage = "forward:/oauth/error";
	
	@RequestMapping(value = "/oauth/authorize")
	public ModelAndView authorize(Map<String, Object> model, @RequestParam Map<String, String> parameters,
			SessionStatus sessionStatus, Principal principal) {
	    //......
	}
	
	@RequestMapping(value = "/oauth/authorize", method = RequestMethod.POST, params = OAuth2Utils.USER_OAUTH_APPROVAL)
	public View approveOrDeny(@RequestParam Map<String, String> approvalParameters, Map<String, ?> model,
			SessionStatus sessionStatus, Principal principal) {
        // ......
	}
}
```



#### 2. 授权确认端点 WhitelabelApprovalEndpoint
该端点用于<u>确认授权</u>，地址：**/oauth/confirm_access**，在请求授权端点 **/oauth/authorize** 时：
* 若客户端的 approved 设置为 true，则自动返回授权码
* 若客户端的 approved 设置为 false（默认值），则重定向到 **/oauth/confirm_access** 页面

![SpringSecurity](https://fgq233.github.io/imgs/security/oauth2_5.png)



#### 3. 授权服务出错端点 WhitelabelErrorEndpoint
<u>授权服务出错端点</u>，地址：**/oauth/error**，当授权出错时，会重定向到该页面``



#### 4. 获取令牌token端点 TokenEndpoint
该端点用于<u>获取令牌 token</u>，请求地址：**/oauth/token**，需要下列参数
* 客户端的：`client_id、client_secret`
* 授权模式：`grant_type`
  * 授权码模式：authorization_code，还需要授权码 `code` 
  * 密码模式：password，还需要认证用户的 `username、password `
  * 刷新令牌模式：refresh_token，还需要刷新令牌 `refresh_token`

返回数据为：`ResponseEntity<OAuth2AccessToken>`，`OAuth2AccessToken`中封装了具体的返回信息
* `token_type、access_token、refresh_token、expires_in、scope`

```java
@FrameworkEndpoint
public class TokenEndpoint extends AbstractEndpoint {

    private Set<HttpMethod> allowedRequestMethods = new HashSet<HttpMethod>(Arrays.asList(HttpMethod.POST));
    
	@RequestMapping(value = "/oauth/token", method=RequestMethod.GET)
	public ResponseEntity<OAuth2AccessToken> getAccessToken(Principal principal, @RequestParam
	Map<String, String> parameters) throws HttpRequestMethodNotSupportedException {
		if (!allowedRequestMethods.contains(HttpMethod.GET)) {
			throw new HttpRequestMethodNotSupportedException("GET");
		}
		return postAccessToken(principal, parameters);
	}
	
	@RequestMapping(value = "/oauth/token", method=RequestMethod.POST)
	public ResponseEntity<OAuth2AccessToken> postAccessToken(Principal principal, @RequestParam
	Map<String, String> parameters) throws HttpRequestMethodNotSupportedException {
		 // ......
	}
}
```


#### 5. 令牌校验端点 CheckTokenEndpoint
该端点用于<u>资源服务器检查令牌是否有效</u>，请求地址：**/oauth/check_token**
* 客户端携带 token 访问资源服务器，先访问该端点校验 token
* 校验成功，才能访问目标资源

```java
@FrameworkEndpoint
public class CheckTokenEndpoint {
    
    // ......
  
    @RequestMapping({"/oauth/check_token"})
    @ResponseBody
    public Map<String, ?> checkToken(@RequestParam("token") String value) {
        OAuth2AccessToken token = this.resourceServerTokenServices.readAccessToken(value);
        if (token == null) {
            throw new InvalidTokenException("Token was not recognised");
        } else if (token.isExpired()) {
            throw new InvalidTokenException("Token has expired");
        } else {
            OAuth2Authentication authentication = this.resourceServerTokenServices.loadAuthentication(token.getValue());
            Map<String, Object> response = this.accessTokenConverter.convertAccessToken(token, authentication);
            response.put("active", true);
            return response;
        }
    }
}
```

#### 6. 获取 JWT 公钥端点  TokenKeyEndpoint
<u>提供公有密钥的端点</u>，在使用JWT格式token时使用，地址：**/oauth/token_key**
* 当**资源服务器启动时**，若配置了 `security.oauth2.resource.jwt.key-uri`，会请求该地址，获取 JWT 签名时的key
* 客户端携带 JWT 格式token 访问资源服务器，根据 key 解析 JWT
  * 解析成功，可以访问资源服务器目标资源
  * 解析失败，返回异常提示

```java
@FrameworkEndpoint
public class TokenKeyEndpoint {
    protected final Log logger = LogFactory.getLog(this.getClass());
    private JwtAccessTokenConverter converter;

    public TokenKeyEndpoint(JwtAccessTokenConverter converter) {
        this.converter = converter;
    }

    @RequestMapping(value = {"/oauth/token_key"}, method = {RequestMethod.GET})
    @ResponseBody
    public Map<String, String> getKey(Principal principal) {
        if ((principal == null || principal instanceof AnonymousAuthenticationToken) && !this.converter.isPublic()) {
            throw new AccessDeniedException("You need to authenticate to see a shared key");
        } else {
            Map<String, String> result = this.converter.getKey();
            return result;
        }
    }
}
```
