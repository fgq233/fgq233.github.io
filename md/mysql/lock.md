### MySQL中的锁
锁是对访问某一资源的限制，通常是为了保持并发访问数据时的一致性、有效性

### 一、锁的分类
按照操作类型，分为2类：读锁(`也叫共享锁`)、写锁(`也叫排他锁`)

按照锁的范围，分为3类
* 全局锁：锁定数据库中的所有表

* 表级锁：锁定整张表
  * 表锁：`表读锁、表写锁`
  * 元数据锁：`MDL读锁、MDL写锁`
  * 意向锁：`意向共享锁、意向排他锁`
  
* 行级锁：锁定表中对应的行数据
  * 行锁：`行读锁、行写锁`
  * 间隙锁
  * 临键锁


### 二、全局锁
#### 1. 效果
![lock1](https://fgq233.github.io/imgs/mysql/lock1.png)

* 对整个数据库实例枷锁，加锁后
  * 数据库实例处于只读状态，只能执行 DQL语句
  * 后续 DML、DDL语句都将被堵塞，直到锁释放
* 应用场景：`mysqldump` 进行数据库备份时，加全局锁保证数据一致性、完整性

#### 2. 全局锁语法
```
-- 加全局读锁
flush tables with read lock;

-- 释放锁
unlock tables;
```


### 三、表级锁
#### 1. 表锁
* 读锁：也叫共享锁，加了表读锁后，加锁的当前会话以及其它会话**只能进行读操作**
* 写锁：也叫排他锁，加了表写锁后，加锁的**当前会话无影响**，其它会话**不能进行读写操作**

![lock2](https://fgq233.github.io/imgs/mysql/lock2.png)

```
-- 加读锁、写锁
lock tables 表名... read;
lock tables 表名... write;

-- 释放锁
unlock tables;
```
  

#### 2. 元数据锁 metadata lock
* 元数据，可以简单理解为表结构
* 元数据锁(`MDL`)：系统自动控制，主要是为了避免DML与DDL冲突，保证读写正确性
  * 当对一张表进行增删改查时，自动加上`MDL读锁(共享锁)`
  * 当对一张表的表结构修改时，自动加上`MDL写锁(排他锁)`
  
* 元数据锁的数据保存在 `performance_schema` 库下 `metadata_locks` 表


#### 3. 意向锁
为了避免DML语句执行时，加的行锁与表锁冲突，在InnonDB引擎中引入意向锁，
使得表锁不用检查每行数据是否加锁，使用意向锁来减少表锁的检查

* 意向共享锁：执行 `select ... lock in share mode` 时添加
  * 与表共享锁（`read`）兼容、与表排他锁（`read`）互斥
  
* 意向排他锁：执行 `insert、update、delete、select ... for update` 时添加
  * 与表共享锁（`read`）、表排他锁（`read`）都互斥
  * 意向锁之间不会互斥
  
* 元数据锁的数据保存在 `performance_schema` 库下 `data_locks` 表中




### 四、行级锁
#### 1. 说明
行级锁应用在 `InnoDB` 存储引擎中，`InnoDB`存储引擎中数据是基于索引组织的，
所以行级锁是通过对索引上的索引项加锁来实现的，而不是对记录加的锁

#### 2. 分类
行级锁分为3类
* 行锁：`Record Lock`，锁定单个行记录，防止其他事务进行`update、delete`，
  * 在读已提交(`read committed`)、可重复读(`repeatable read`)隔离级别下都支持

* 间隙锁：`Gap Lock`，锁定索引记录间隙，确保索引记录间隙不变，
防止其他事务在这个间隙进行`insert`，产生幻读
  * 可重复读(`repeatable read`)隔离级别下支持

* 临键锁：`Next-Key Lock`，行锁和间隙锁的组合，同时锁住行记录、间隙
防止其他事务在这个间隙进行`insert`，产生幻读
  * 可重复读(`repeatable read`)隔离级别下支持


#### 3. 行锁
* 行读锁（共享锁）：加了锁后，加锁的当前会话以及其它会话**只能进行该行的读操作**

* 行写锁（排他锁）：加了锁后，加锁的**当前会话无影响**，其它会话**不能进行该行的读写操作**

* SQL语句加的行锁
    * `insert、update、delete` 自动加写锁
    * `select ... for update`  手动加写锁
    * `select ...`   不加锁
    * `select ... lock in share mode`  手动加读锁
    
* 行锁的数据也保存在 `performance_schema` 库下 `data_locks` 表中

