###  邮件任务 
邮件任务可以向一个或多个收信人发送邮件，支持cc，bcc，HTML文本

#### 1、配置邮件服务器
* 接收任务是等待特定消息到达的任务


| 参数                    | 必填          | 描述                                              |
|-----------------------|-------------|-------------------------------------------------|
| `mailServerHost       ` | 否           | 邮件服务器的主机名（如mail.mycorp.com），默认为localhost        |
| `mailServerPort       ` | 是，如果不使用默认端口 | 邮件服务器的SMTP端口，默认值为25                             |
| `mailServerDefaultFrom` | 否           | 若用户没有提供地址，默认使用的邮件发件人地址。默认为flowable@flowable.org |
| `mailServerUsername   ` | 若服务器需要      | 部分邮件服务器发信时需要进行认证，默认为空                           |
| `mailServerPassword   ` | 若服务器需要      | 部分邮件服务器发信时需要进行认证，默认为空                           |
| `mailServerUseSSL     ` | 若服务器需要      | 部分邮件服务器要求ssl通信，默认设置为false                       |
| `mailServerUseTLS     ` | 若服务器需要      | 部分邮件服务器要求TLS通信（例如gmail），默认设置为false              |


```
flowable:
  mail:
    server:
      default-from: 18200000000@163.com
      host: smtp.163.com
      username: 18200000000@163.com
      password: 163邮箱授权码
      s-s-l-port: 465
      use-ssl: true
      use-tls: true
      default-charset: utf-8
```


#### 2、邮件的信息
* 邮件任务可以设置下列邮件具体信息参数
* 这些参数的值可以使用EL表达式

| 参数                      | 必填  | 描述                                                   |
|-------------------------|-----|------------------------------------------------------|
| `to          `          | 是   | 邮件的收信人，可以使用逗号分隔的列表定义多个接收人      |
| `from        `          | 否   | 邮件的发信人地址，如果不设置，会使用默认配置的地址      |
| `subject     `          | 否   | 邮件的主题                          |
| `cc          `          | 否   | 邮件的抄送人，可以使用逗号分隔的列表定义多个接收人      |
| `bcc         `          | 否   | 邮件的密送人，可以使用逗号分隔的列表定义多个接收人      |
| `charset     `          | 否   | 可以指定邮件的字符集，对许多非英语语言很必要         |
| `html        `          | 否   | 邮件的HTML文本                      |
| `text        `          | 否   | 邮件的内容                          |
| `htmlVar     `          | 否   | 存储邮件HTML内容的流程变量名               |
| `textVar     `          | 否   | 存储邮件纯文本内容的流程变量名                |
| `ignoreException      ` | 否   | 处理邮件失败时，是忽略还是抛出FlowableException，默认设置为false          |
| `exceptionVariableName` | 否   | 如果设置ignoreException = true，而处理邮件失败时，则使用给定名字的变量保存失败信息 |




