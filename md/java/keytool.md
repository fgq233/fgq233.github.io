###  keytool  
### 一、介绍
#### 1. 作用
* `keytool` 是`Java`自带的数据证书管理工具，无需单独安装，只要安装有`JDK`或`JRE`，就可以使用
* `keytool` 将密钥（`key`）和证书（`certificates`）存在一个`keystore`的文件中，在`keystore`里只包含两种数据：
  * 密钥实体：私钥 + 公钥
  * 可信任的证书实体：只包含公钥
  
#### 2. keytool 命令 
```
C:\Users\Administrator\Desktop>keytool  -help
密钥和证书管理工具
命令:
 -certreq            生成证书请求
 -changealias        更改条目的别名
 -delete             删除条目
 -exportcert         导出证书(旧版本：export)
 -genkeypair         生成密钥对(旧版本：genkey)
 -genseckey          生成密钥
 -gencert            根据证书请求生成证书
 -importcert         导入证书或证书链(旧版本：import)
 -importpass         导入口令
 -importkeystore     从其他密钥库导入一个或所有条目
 -keypasswd          更改条目的密钥口令
 -list               列出密钥库中的条目
 -printcert          打印证书内容
 -printcertreq       打印证书请求的内容
 -printcrl           打印 CRL 文件的内容
 -storepasswd        更改密钥库的存储口令
```

#### 3. genkeypair 生成秘钥 - 相关选项 
```
C:\Users\Administrator\Desktop>keytool -genkeypair -help
keytool -genkeypair [OPTION]...
生成密钥对
选项:
 -alias <alias>                  要处理的条目的别名
 -keyalg <keyalg>                密钥算法名称
 -keysize <keysize>              密钥位大小
 -sigalg <sigalg>                签名算法名称
 -destalias <destalias>          目标别名
 -dname <dname>                  唯一判别名
 -startdate <startdate>          证书有效期开始日期/时间
 -ext <value>                    X.509 扩展
 -validity <valDays>             有效天数
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型，默认JKS
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
 -protected                      通过受保护的机制的口令
```

#### 4. importcert 导入证书或证书链 - 相关选项
```
C:\Users\Administrator\Desktop>keytool -importcert -help
keytool -importcert [OPTION]...
导入证书或证书链
选项:
 -noprompt                       不提示
 -trustcacerts                   信任来自 cacerts 的证书
 -protected                      通过受保护的机制的口令
 -alias <alias>                  要处理的条目的别名
 -file <filename>                输入文件名
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
```


#### 5. exportcert 导出证书 - 相关选项
```
C:\Users\Administrator\Desktop>keytool -exportcert -help
keytool -exportcert [OPTION]...
导出证书
选项:
 -rfc                            以 RFC 样式输出
 -alias <alias>                  要处理的条目的别名
 -file <filename>                输出文件名
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
 -protected                      通过受保护的机制的口令
```

### 二、https 双向认证
双向验证，就需要双方的密钥，服务端(`后台`)为 server，客户端(`浏览器`)为 client
* 生成服务端秘钥、导出服务端证书 cert
* 生成客户端秘钥、导出客户端证书 cert
* 将客户端 cert 导入服务端秘钥库，将服务端 cert 导入客户端秘钥库

#### 1. 生成服务端秘钥、客户端秘钥
```
# 服务端秘钥
keytool -genkey -alias server -storetype PKCS12 -keyalg RSA -keysize 2048 -validity 365 -keystore server.p12
# 客户端秘钥
keytool -genkey -alias client -storetype PKCS12 -keyalg RSA -keysize 2048 -validity 365 -keystore client.p12
```

![keytool](https://fgq233.github.io/imgs/java/keytool.jpg)

#### 2. 导出服务端证书、客户端证书
```
# 服务端证书
keytool -export -alias server -file server.cer -keystore server.p12
# 客户端证书
keytool -export -alias client -file client.cer -keystore client.p12
```

#### 3. 将对方证书(cert)导入到自己的信任证书库(trust store)
```
# 客户端 cert 导入服务端秘钥
keytool -import -alias client -file client.cer -keystore server.p12
# 服务端 cert 导入客户端秘钥
keytool -import -alias server -file server.cer -keystore client.p12
```

#### 4. 查看秘钥库
查看秘钥库，可以发现证书链中都有2个证书

```
# 服务端秘钥库
keytool -list -v -keystore server.p12 -storepass fgq666
# 客户端秘钥库
keytool -list -v -keystore client.p12 -storepass fgq666
```


<details>
<summary>服务端秘钥库</summary>
<pre>
<code>
C:\Users\Administrator\Desktop>keytool -list -v -keystore server.p12 -storepass
fgq666

密钥库类型: JKS
密钥库提供方: SUN

您的密钥库包含 2 个条目

别名: server
创建日期: 2023-1-18
条目类型: PrivateKeyEntry
证书链长度: 1
证书[1]:
所有者: CN=fgq, OU=rx, O=rx, L=wh, ST=ah, C=cn
发布者: CN=fgq, OU=rx, O=rx, L=wh, ST=ah, C=cn
序列号: 4c957ef8
有效期开始日期: Wed Jan 18 15:26:01 CST 2023, 截止日期: Thu Jan 18 15:26:01 CST
2024
证书指纹:
MD5: 43:4D:D7:FF:93:79:85:AB:EA:EA:C1:8C:6D:17:3C:8A
SHA1: 0D:97:0D:6B:66:DE:DD:4D:59:2B:2D:C8:59:E8:84:74:A5:C4:8A:25
SHA256: 11:23:2C:9D:FD:F4:D6:A1:4E:50:73:6D:81:FA:F4:31:81:63:0D:AE:37:
57:3B:16:64:98:1E:E1:E5:9A:0B:FA
签名算法名称: SHA256withRSA
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 15 C2 18 30 5E 6C D3 5A   74 6A 56 FF 5D AD CB 19  ...0^l.ZtjV.]...
0010: B0 D2 F7 39                                        ...9
]
]



*******************************************
*******************************************


别名: client
创建日期: 2023-1-18
条目类型: trustedCertEntry

所有者: CN=fgq, OU=rx, O=rx, L=wh, ST=ah, C=cn
发布者: CN=fgq, OU=rx, O=rx, L=wh, ST=ah, C=cn
序列号: 5a2d1eae
有效期开始日期: Wed Jan 18 15:27:10 CST 2023, 截止日期: Thu Jan 18 15:27:10 CST
2024
证书指纹:
MD5: 15:AA:FF:4D:89:45:38:B3:3C:14:70:20:7D:34:BD:47
SHA1: 5D:C4:DB:63:8C:B9:10:23:A1:ED:14:D4:79:43:AD:1C:1A:3D:3F:ED
SHA256: EA:F5:8E:A8:FD:F3:D4:30:EC:31:8B:F1:9E:FA:61:7B:FC:AB:C8:E0:D6:
67:CF:F5:D1:41:DB:02:E4:2E:32:AF
签名算法名称: SHA256withRSA
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 1D D4 79 66 2F FC 1B D1   58 F7 8F C7 85 17 2F C2  ..yf/...X...../.
0010: 9D 79 86 95                                        .y..
]
]
</code>
</pre>
</details>



### 三、SpringBoot 配置 https 单向认证
单向验证：客户端验证服务端，一般是通过CA颁发的SSL证书来验证
#### 1、生成服务端秘钥 server.p12
参考上面

#### 2、pom.xml 配置
将 `server.p12` 放到 `src/main/resources` 目录下

```
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>server.p12</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
        </resource>
    </resources>
</build>
```

#### 3、application.yaml 配置
```
server:
  port: 8888
  ssl:
    client-auth: none
    key-store-type: PKCS12
    key-alias: server
    key-store: classpath:server.p12
    key-store-password: fgq666
```

* `server.ssl.client-auth` 
  * none：单向认证，不验证客户端，客户端浏览器不用导入证书
  * want：会验证客户端，但不强制验证，即验证失败也可以成功建立连接
  * need：双向验证
* `server.ssl.key-store-type`：秘钥库类型，`JKS、PKCS12`...
* `server.ssl.alias`：秘钥库别名
* `server.ssl.key-password`：秘钥库密码

#### 4、测试
```java
@RestController
public class TestController {
    
    @ResponseBody
    @RequestMapping("test")
    public String test() {
        return "success";
    }
}
```

* [http://localhost:8888/test](http://localhost:8888/test)  访问失败
* [https://localhost:8888/test](https://localhost:8888/test) 访问成功


### 四、SpringBoot 配置 https 双向认证
双向认证：不仅客户端需要验证服务端，服务端同样也需要验证客户端
#### 1、双向认证操作 
参考二，生成秘钥、导出证书、互相信任证书

#### 2、pom.xml 配置
参考三

#### 3、application.yaml 配置
```
server:
  port: 8888
  ssl:
    client-auth: need
    key-store-type: PKCS12
    key-alias: server
    key-store: classpath:server.p12
    key-store-password: fgq666
    # 双向认证需要开启 Trust Store 相关配置
    trust-store-type: PKCS12
    trust-store: classpath:server.p12
    trust-store-password: fgq666
```

#### 4、安装证书 server.cer 或 client.cer 
双击安装证书，重启浏览器

#### 5. 测试
```
@RestController
public class TestController {

    @ResponseBody
    @RequestMapping("test")
    public String test(HttpServletRequest request) {
//      双向认证时获取客户端证书
        X509Certificate[] certs = (X509Certificate[])request.getAttribute("javax.servlet.request.X509Certificate");
        return "success";
    }

}
```
