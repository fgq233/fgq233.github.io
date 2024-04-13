###  SpringBoot 集成 Flowable
通过 `bpmn2.xml` 部署流程

### 一、环境
* SpringBoot2.6.13
* JDK8
* Flowable6.7.2
* MySQL8

#### 1. 依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!--Flowable的核心依赖-->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>6.7.2</version>
</dependency>

<!--MySQL驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### 2. application.yml
```
server:
  port: 8888
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/flowable?serverTimezone=UTC&nullCatalogMeansCurrent=true
    username: root
    password: 123456
flowable:
  async-executor-activate: true  # 关闭定时任务JOB
  database-schema-update: true    
```

**databaseSchemaUpdate**：用于设置流程引擎启动关闭时，使用的数据库表结构控制策略

* `false` (默认): 当引擎启动时，检查数据库表结构的版本是否匹配库文件版本，版本不匹配时抛出异常
* `true`: 构建引擎时，检查并在需要时更新表结构，表结构不存在则会创建
* `create-drop`: 引擎创建时创建表结构，并在引擎关闭时删除表结构
