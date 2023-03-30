### 生成SSH秘钥
#### 1. 安装git

#### 2. 生成SSH秘钥
在 `git` 安装目录的 `usr\bin` 目录下执行下面的命令

```
ssh-keygen -t ed25519 -C "18266666666@163.com"
```

#### 3. 获取秘钥内容
生成的秘钥在 `C:\Users\用户名\.ssh` 目录下


#### 4. 将秘钥内容添加到git仓库
在 `github - Settings - SSH and GPG keys - SSH keys` 中添加 `SSH` 秘钥


#### 5. 使用项目 ssh 地址clone项目



