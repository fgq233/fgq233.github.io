### 压缩、解压
#### 1. Linux 系统常用压缩格式
* `.tar`文件，`tarball`归档文件，简单的将文件组装到一个`.tar`的文件内，没有压缩效果
* `.gz`文件，`gzip`格式压缩文件，使用`gzip`压缩算法将文件压缩到一个文件内
* `.zip`文件

#### 2. tar 命令
* 作用：压缩和解压`.tar、.gz、.xz`3种格式

* 语法：`tar [-c -v -x -f -z -C -J] 参数1 参数2... `
  * `-c` 创建压缩文件，用于压缩模式
  * `-v` 显示压缩、解压过程，用于查看进度
  * `-x` 解压模式
  * `-f` 表示要创建的文件，或要解压的文件，必须在所有选项中位置处于最后一个
  * `-z` `gzip`压缩模式，若要使用则一般在处于第一个
  * `-C` 选择解压的目的地，用于解压模式
  * `-J` `xz`压缩模式

* 压缩示例
  * `tar -cvf my.tar 1.txt 2.txt 3.txt`  将3个文件压缩到 `my.tar `
  * `tar -zcvf my.tar.gz 1.txt 2.txt 3.txt`  使用`gzip`压缩模式将3个文件压缩到 `my.tar.gz`
  * `tar -Jcvf my.tar.xz 1.txt 2.txt 3.txt`  使用`xz`压缩模式将3个文件压缩到 `my.tar.xz`
* 解压示例
  * `tar -xvf my.tar` 解压到当前目录
  * `tar -xvf my.tar -C /home/fgq233`  解压到指定目录
  * `tar -zxvf my.tar.gz -C /home/fgq233`  解压`.gz`格式到指定目录
  * `tar -Jxvf my.tar.gz -C /home/fgq233`  解压`.xz`格式到指定目录


#### 3. zip、unzip 命令
* 作用：`zip、unzip`命令分别用于：压缩、解压`.zip`格式
* 语法
  * `zip [-r] 参数1 参数2...`，`-r` 用于压缩内容包含文件夹的时候
  * `unzip [-d] 参数1 参数2...`，`-d` 指定要解压去的位置
  * 
* 压缩示例：`zip my.zip 1.txt 2.txt 3.txt` 
* 解压示例：`unzip my.zip -d /home/fgq233` 


