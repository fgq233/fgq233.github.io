### Docker监控之CIG (CAdvisor、InfluxDB、Granfana)

### 一、 docker查看容器所占 CPU、内存、I/O 信息
```
docker stats
```

### 二、 CIG 查看容器所占 CPU、内存、I/O 信息
* CAdvisor 监控收集
* InfluxDB 存储数据
* Granfana 展示图表

#### 1. vim docker-compose.yml 
```
version: "3.1"
 
volumes:
  grafana_data: {}
 
services:
 influxdb:
  image: tutum/influxdb:0.9
  restart: always
  environment:
    - PRE_CREATE_DB=cadvisor
  ports:
    - "8083:8083"
    - "8086:8086"
  volumes:
    - ./data/influxdb:/data
 
 cadvisor:
  image: google/cadvisor
  links:
    - influxdb:influxsrv
  command: 
    -storage_driver=influxdb -storage_driver_db=cadvisor -storage_driver_host=influxsrv:8086
  restart: always
  ports:
    - "8080:8080"
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:rw
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
 
 grafana:
  user: "104"
  image: grafana/grafana
  restart: always
  links:
    - influxdb:influxsrv
  ports:
    - "3000:3000"
  volumes:
    - grafana_data:/var/lib/grafana
  environment:
    - HTTP_USER=admin
    - HTTP_PASS=admin
    - INFLUXDB_HOST=influxsrv
    - INFLUXDB_PORT=8086
    - INFLUXDB_NAME=cadvisor
    - INFLUXDB_USER=root
    - INFLUXDB_PASS=root
```

#### 2. 检测
```
docker-compose config -q           
``` 

#### 3. 一键部署 CIG 容器
```
docker-compose up -d
``` 

#### 4. 查看容器状态
```
docker ps
```  

#### 5. 测试
* `CAdvisor` 地址：http://ip:8080
* `InfluxDB` 地址：http://ip:8083
* `Granfana` 地址：http://ip:3000

