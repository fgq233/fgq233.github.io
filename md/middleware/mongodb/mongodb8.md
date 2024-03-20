### MongoDB 安全认证
### 一.  MongoDB的用户、角色、权限
#### 1.  安全问题
* 安全问题：默认情况下MongoDB 实例启动运行时是没有启用用户访问权限控制的，在实例本机服务器上都可以
随意连接到实例进行各种操作，MongoDB不会对连接客户端进行用户验证，这是非常危险的
* 保障 MongoDB 的安全的几种措施
    * 使用新的端口
    * 设置mongodb的网络环境，最好将mongodb部署到公司服务器内网，这样外网是访问不到的，公司内部访问使用vpn
    * 开启安全认证：客户端连接到 MongoDB 的账号密码认证、MongoDB 集群内部服务器之间认证

#### 2. 开启用户访问控制
开启用户访问控制(用户验证)两种方式
* 在MongoDB实例启动时使用选项 `--auth` 
* 在指定启动配置文件中添加配置 `security.authorization`

```
security:
  authorization: enabled
```

#### 3. 相关概念
* **访问控制**：MongoDB使用的是基于角色的访问控制(`Role-Based Access Control,RBAC`)来管理用户对实例的访问，
通过对用户授予一个或多个角色来控制用户访问数据库资源的权限和数据库操作的权限，在对用户分配角色之前，
用户无法访问实例

* **角色**：在MongoDB中通过角色对用户授予相应数据库资源的操作权限，每个角色当中的权限可以显式指定，
也可以继承其他角色的权限
    * 在同一个数据库中，新创建的角色可以继承该数据库其他角色的权限
    * 在admin数据库中，新创建的角色可以继承任意数据库中角色的权限

* **权限**：由指定的数据库资源(`resource`)以及允许在指定资源上进行的操作(`action`)组成
    * 资源(resource)包括：数据库、集合、部分集合和集群
    * 操作(action)包括：对资源进行的增、删、改、查
    
 
```
查询所有角色权限(包含内置角色)
db.runCommand({ rolesInfo: 1, showBuiltinRoles: true })

查询所有角色权限(仅用户自定义角色)
db.runCommand({ rolesInfo: 1 })

查询当前数据库中的某角色的权限
db.runCommand({ rolesInfo: "<rolename>" })

查询其它数据库中指定的角色权限
db.runCommand({ rolesInfo: { role: "<rolename>", db: "<database>" } }

查询多个角色权限
db.runCommand({rolesInfo: ["<rolename>", {role: "<rolename>", db: "<database>" },...]})
```


<details><summary>角色权限</summary>
<pre><code>
{
        "roles" : [
                {
                        "role" : "clusterMonitor",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "readWriteAnyDatabase",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "root",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "dbOwner",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "clusterAdmin",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "userAdmin",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "enableSharding",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "clusterManager",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "readAnyDatabase",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "backup",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "read",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "dbAdmin",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "restore",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "__queryableBackup",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "hostManager",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "__system",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "userAdminAnyDatabase",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "readWrite",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                },
                {
                        "role" : "dbAdminAnyDatabase",
                        "db" : "admin",
                        "isBuiltin" : true,
                        "roles" : [ ],
                        "inheritedRoles" : [ ]
                }
        ],
        "ok" : 1
}
</code></pre>
</details>



常用的内置角色：
* 数据库用户角色：read、readWrite
* 所有数据库用户角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
* 数据库管理角色：dbAdmin、dbOwner、userAdmin
* 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager
* 备份恢复角色：backup、restore
* 超级用户角色：root
* 内部角色：system

| 角色    | 权限描述   | 
| ------ | ----------| 
| read     | 可以读取指定数据库中任何数据 | 
| readWrite     | 可以读写指定数据库中任何数据，包括创建、重命名、删除集合| 
| readAnyDatabase      | 可以读取所有数据库中任何数据(除了config库和local库) | 
| readWriteAnyDatabase  | 可以读写所有数据库中任何数据(除了config库和local库)|
| userAdminAnyDatabase  |可以在指定数据库创建和修改用户(除了config库和local库) |
| dbAdminAnyDatabase   | 可以读取任何数据库以及对数据库进行清理、修改、压缩、获取统计信息、执行检查等操作(除了config库和local库) |
| dbAdmin           | 可以读取指定数据库以及对数据库进行清理、修改、压缩、获取统计信息、执行检查等操作 |
| userAdmin           |可以在指定数据库创建和修改用户 |
| clusterAdmin           | 可以对整个集群或数据库系统进行管理操作 |
| backup           |备份MongoDB数据的权限 |
| restore           |从备份文件中还原恢复MongoDB数据的权限 |
| root           | 超级账号，超级权限|


### 二.  单机环境
#### 1.  用户的创建、删除、查询、认证
```
# 连接
mongo --host=127.0.0.1 --port=27017

# 切换到admin库
use admin

# 创建管理用户
db.createUser({user:"fgqRoot", pwd:"123456", roles:[{"role": "root", "db":"admin" }]})

# 创建普通用户
use fgq
db.createUser({user:"fgq6666", pwd:"666666", roles:[{"role": "readWrite", "db":"fgq" }]})

# 查看已经创建的用户
db.system.users.find()

# 删除用户
db.dropUser("fgq6666")

# 修改用户密码
db.changeUserPassword("fgqRoot", "666666")

# 认证
db.auth("fgqRoot","666666")
```

* Mongodb存储所有的用户信息在 `admin` 数据库的集合 `system.users` 中，保存用户名、密码和数据库信息
* 如果不指定数据库，则创建的指定的权限的用户在所有的数据库上有效，如 `{role:"readWrite", db:""}`
* 如果开启了认证，必须先使用拥有 `admin` 库操作权限的用户登录认证，然后才能创建其他角色的用户
* 通常，在未认证时，创建一个admin库用户，一个普通用户，admin库用户用来管理，普通用户用来日常开发


#### 2.  单机认证
```
# 启动服务，开启用户访问控制，或者在配置文件中启用 security.authorization
mongod -f ../conf/mongodb.conf --auth

# 认证方式一：
mongo --host=127.0.0.1 --port=27017
use fgq
db.auth("fgq6666","666666")

# 认证方式二：
mongo --host=127.0.0.1 --port=27017 --authenticationDatabase fgq -u fgq6666 -p 666666
```




#### 3. SpringData MongoDB 单机认证
```
spring:
  data:
    mongodb:
     uri:  mongodb://fgq6666:666666@127.0.0.1:27017/fgq
```



### 三.  副本集环境
#### 1.  2个认证
副本集认证分为两部分
* 客户端用户名、密码认证(同单机环境)
* 副本集各个节点成员之间认证，各个节点需要保证有相同的密钥或者证书
    * **密钥文件**：可以使用任何方法生成密钥文件，内容在6到1024个字符之间
    * **x.509证书**

#### 2.  副本集认证步骤
* 无访问控制，启动副本集中所有节点
* 连接主节点，创建一个管理员、一个普通用户(参考单机环境)
* 创建密钥文件
    * 密钥文件内容其实就是一串字符串
    * 将密钥文件复制到副本集所有节点下各一份
* 所有节点启用访问控制，并添加密钥文件位置

```
security:
  keyFile: D:\MyDevelop\MongoDB\mongodb1\keyfile.txt
  authorization: enabled
```

重启副本集中所有服务


#### 3. SpringData MongoDB 副本集认证
```
spring:
  data:
    mongodb:
      uri: mongodb://fgq6666:666666@127.0.0.1:27001,127.0.0.1:27002,127.0.0.1:27003/fgq?connect=replicaSet&slaveOk=true&replicaSet=shard1
```


### 四.  分片集群环境
#### 1. 分片集群认证步骤
* 无访问控制，启动分片集群
* `mongos` 连接路由服务，创建一个管理员、一个普通用户(参考单机环境)
    * 通过mongos 添加的账号信息，保存在配置节点的服务中
    * 具体的数据节点不保存账号信息，因此，分片中的账号信息不涉及到同步问题
* 生成密钥文件，复制到所有节点（`路由节点、配置节点、副本集节点`）
* 所有节点的配置文件添加：密钥位置、认证控制(`路由节点不用配置`)

```
security:
  keyFile: D:\MyDevelop\MongoDB\mongodb1\keyfile.txt    # 所有节点都需要配置
  authorization: enabled                                # 路由节点不用配置
```


#### 2. SpringData MongoDB 副本集认证
```
spring:
  data:
    mongodb:
      uri: mongodb://fgq6666:666666@127.0.0.1:27101,127.0.0.1:27102/fgq
```
