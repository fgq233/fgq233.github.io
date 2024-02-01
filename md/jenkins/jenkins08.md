### Jenkins 流水线 pipeline
### 一、 流水线说明
### 1. 作用
使用 pipeline 脚本代码来构建、部署项目

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
* `agent`    指定流水线任务在哪个节点服务器执行
  * `any` 不指定，由 Jenkins分配
  * `label` 指定节点标签
* `stages`   所有要执行的阶段
* `stage`    执行的具体某一阶段，可以有多个
* `steps`    阶段内的每一步



### 二、 使用 pipeline 自动打包 docker 镜像
```
pipeline {
    agent any
    
    tools {
        // Dashboard > Manage Jenkins > Tools 中已经配置好 maven
        maven 'maven3.9'
    }

    stages {
        stage('拉取Gitlab代码') {
            steps {
                git branch: 'master', credentialsId: 'root-password-id', url: 'http://192.167.18.130/root/SpringBootTest.git'
            }
        }
        stage('Jenkins服务器执行构建') {
            steps {
               sh """
                    mvn clean package
                    mvn package
               """
            }
        }
        stage('清除镜像(非首次运行添加该steps') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: 'TestServer', 
                            transfers: [sshTransfer(cleanRemote: false, excludes: '', 
                            execCommand: '''docker stop demo
                                            docker rm demo
                                            docker rmi demo:1.0
                                            rm -rf /root/app/*''', 
                                            execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', 
                                            remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')
                            ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
            }
        }
        stage('发送jar、Dockerfile到服务器，构建镜像') {
            steps {
              sshPublisher(publishers: [sshPublisherDesc(configName: 'TestServer', 
                          transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '', execTimeout: 120000, 
                                      flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', 
                                      remoteDirectory: '/app', remoteDirectorySDF: false, removePrefix: '/target', 
                                      sourceFiles: '**/SpringBootTest*.jar'), 
                                      sshTransfer(cleanRemote: false, excludes: '', 
                                      execCommand: '''cd /root/app
                                                      docker build -t demo:1.0  .
                                                      docker run -d -p 8888:8888 --name demo --privileged=true demo:1.0''', 
                                                      execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, 
                                                      patternSeparator: '[, ]+', remoteDirectory: '/app', remoteDirectorySDF: false, 
                                                      removePrefix: '', sourceFiles: 'Dockerfile')], 
                                      usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
            }
        }
    }
}
```
