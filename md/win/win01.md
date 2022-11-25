### Windows系统解除端口占用
#### 1、查看端口占用情况
```
查看所有端口占用情况
netstat -ano 

查看8080端口占用情况
netstat -ano|findstr 8080
```

#### 2、根据PID找出占用8080端口的进程
```
tasklist|findstr 6440
```

#### 3、杀死该进程
```
通过名称杀死
taskkill /f /t /im java.exe 

通过进程id杀死
taskkill /f /t /im 6440
```
