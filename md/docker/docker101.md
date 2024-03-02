### Docker 容器日志过大处理
在Linux上，容器日志一般存放在 `/var/lib/docker/containers/container_id`下面，以 `-json.logs` 结尾的文件(业务日志)一般很大


#### 1. 查看所有容器的日志大小
```
ls -lh $(find /var/lib/docker/containers/ -name *-json.log)
```

#### 2. 方式一：清理日志(治标)
```
#  创建清理日志 shell 脚本
vim xxx.sh

#  shell 脚本内容
echo "======== start clean docker containers logs ========"  
logs=$(find /var/lib/docker/containers/ -name *-json.log)  
for log in $logs  
        do  
                echo "clean logs : $log"  
                cat /dev/null > $log  
        done  
echo "======== end clean docker containers logs ========"     

#  授权
chmod +x ./xxx.sh 

#  执行清理脚本
./xxx.sh 
``` 


* 注意：Linux中，单纯使用 rm -rf删除文件，若该文件有一个进程正在使用，并不会释放磁盘空间



#### 3. 方式二：运行容器时添加参数
```
# 单独启动
docker run -d \
    --log-opt max-size=100m \
    --log-opt max-file=3 \
    --name ng nginx:latest
 
 
# docker-compose 启动   
nginx:
  image: nginx:latest
  logging:
    driver: "json-file"
    options:
      max-size: "100m"
      max-file: 3
``` 

* max-size 一个容器日志大小上限为 100MB
* max-file 最多保存3个日志文件，分别是id+json, id+1.json, id+2.json

#### 3. 方式三：修改 docker 全局配置文件 /etc/docker/daemon.json
```
# 配置文件内容
{
    // ....
    "log-driver":"json-file",
    "log-opts":{ "max-size":"100m","max-file":"3"}
    // ....
}

# 重启docker
systemctl daemon-reload
systemctl restart docker
```  
