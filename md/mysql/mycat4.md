### MyCat 分片规则 rule.xml
水平分表需要配置分片规则，因为同一张表存放在不同库中，需要知道分片规则将数据存放在不同分片节点

### 一、 按照id范围
#### 1. rule.xml
```
<tableRule name="auto-sharding-long">
    <rule>
        <columns>id</columns>
        <algorithm>rang-long</algorithm>
    </rule>
</tableRule>

<function name="rang-long" class="io.mycat.route.function.AutoPartitionByLong">
    <property name="mapFile">autopartition-long.txt</property>
</function>
```

#### 2. autopartition-long.txt
```
# range start-end ,data node index
# K=1000,M=10000.
0-500M=0        # 分片1：id在1-500W的数据
500M-1000M=1    # 分片2：id在500W-1000W的数据
1000M-1500M=2   # 分片3：id在1000W-1500W的数据
```


### 二、 按照id取模  
```
<tableRule name="mod-long">
    <rule>
        <columns>id</columns>
        <algorithm>mod-long</algorithm>
    </rule>
</tableRule>

<function name="mod-long" class="io.mycat.route.function.PartitionByMod">
    <property name="count">3</property>
</function>
```

`count` 设置为节点数量，`id%count`取模，根据取模结果决定数据在哪个分片


### 三、 按照id进行hash算法
```
<tableRule name="sharding-by-murmur">
    <rule>
        <columns>id</columns>
        <algorithm>murmur</algorithm>
    </rule>
</tableRule>

<function name="murmur" class="io.mycat.route.function.PartitionByMurmurHash">
    <!-- 默认是0 -->
    <property name="seed">0</property>
    <!-- 要分片的数据库节点数量，必须指定，否则没法分片 -->
    <property name="count">2</property>
    <!-- 一个实际的数据库节点被映射为这么多虚拟节点，默认是160倍，也就是虚拟节点数是物理节点数的160倍 -->
    <property name="virtualBucketTimes">160</property>
</function>
```

* 使用 id 进行 hash 运算，然后根据结果决定划分到哪个分区
* 一致性：相同的哈希因子计算值总是被划分到相同的分区表中，不会因为分区节点的增加而改变原来数据的分区位置

 
 
### 四、 枚举分片
根据`sharding_id`的枚举值，通过配置文件中配置的枚举值与分片对应关系，指定数据分布到哪个节点上

#### 1. rule.xml
```
<tableRule name="sharding-by-intfile">
    <rule>
        <columns>sharding_id</columns>
        <algorithm>hash-int</algorithm>
    </rule>
</tableRule>

<function name="hash-int" class="io.mycat.route.function.PartitionByFileMap">
    <property name="mapFile">partition-hash-int.txt</property>
</function>
```

一般需要在`rule.xml`中将 `tableRule` 和 `function` 都复制一份，枚举文件也复制一份，因为可能会存在多个枚举分片的表

#### 2. partition-hash-int.txt
```
3401=0      # 分片1：枚举值为3401
3402=1      # 分片2：枚举值为3402
3403=2      # 分片3：枚举值为3403
```


### 五、 按日分片
```
<tableRule name="sharding-by-date">
    <rule>
        <columns>createTime</columns>
        <algorithm>partbyday</algorithm>
    </rule>
</tableRule>

<function name="partbyday" class="io.mycat.route.function.PartitionByDate">
    <property name="dateFormat">yyyy-MM-dd</property>
    <property name="sNaturalDay">0</property>
    <property name="sBeginDate">2022-01-01</property>
    <property name="sEndDate">2022-01-30</property>
    <property name="sPartionDay">10</property>
</function>
```

* `dateFormat`  日期格式
* `sBeginDate`  开始时间
* `sEndDate`    结束时间
* `sPartionDay` 时间周期
* 结束时间和开始时间相差30天，每10天一个分片，30 / 10 = 总共有3个节点，到达结束时间后，再次从开始分片开始插入
* 注意：逻辑表的 `dataNode` 节点数量，必须与此处计算出的节点数量一致


### 六、 按月分片
每个自然月一个分片

```
<tableRule name="sharding-by-month">
    <rule>
        <columns>createTime</columns>
        <algorithm>partbymonth</algorithm>
    </rule>
</tableRule>

<function name="partbymonth" class="io.mycat.route.function.PartitionByMonth">
    <property name="dateFormat">yyyy-MM-dd</property>
    <property name="sBeginDate">2022-01-01</property>
    <property name="sEndDate">2022-12-31</property>
</function>
```



* 结束时间和开始时间相差12个月，需要有12个分片节点
* 注意：逻辑表的 `dataNode` 节点数量，必须与此处计算出的节点数量一致
