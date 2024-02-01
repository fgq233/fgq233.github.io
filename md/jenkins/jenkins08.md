### Jenkins 流水线 pipeline
### 一、 流水线说明
### 1. 作用
* 搭建一台 Jenkins 服务器，启动 Jenkins
* 准备好集群中其他几台服务器
* 在启动的 Jenkins 网页中，添加其他服务器节点 `Dashboard > Manage Jenkins > Nodes > New node`

#### 2. 语法
```
pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
    }
}
```

* `pipeline` 整条流水线
* `agent`    指定流水线任务在哪个服务器执行，
* `stages`   所有要执行的阶段
* `stage`    执行的具体某一阶段，可以有多个
* `steps`    阶段内的每一步



### 二、 流水线使用
在新建 Item 时选择 Pipeline

### 1. 作用
* 搭建一台 Jenkins 服务器，启动 Jenkins
