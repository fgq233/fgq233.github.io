### 环境变量

#### 1. env 命令
* 该命令可查看当前系统中记录的环境变量
* 环境变量是一种 `key=value` 型结构

#### 2. PATH 环境变量
* 当把程序目录配置到`PATH`环境变量，则无论在哪个位置，都能执行该程序
* 示例：`/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/fgq233/.local/bin`
* 不同目录通过 `:` 分割
 
 
#### 3. 设置环境变量
* 临时生效：直接在命令行执行 `export 变量名=变量值`
* 永久生效：在配置文件中添加 `export 变量名=变量值`，执行`source 配置文件名`立刻生效
  * 针对`当前用户`永久，编辑`~/.bashrc`，重新加载`source ~/.bashrc`
  * 针对`所有用户`永久，编辑`/etc/profile`，重新加载`source /etc/profile`
  
  
#### 4. 设置 PATH 环境变量
* 临时生效：`export PATH=$PATH:目录名`
* 永久生效：将`export PATH=$PATH:目录名` 放到环境变量配置文件中，执行`source 配置文件名`立刻生效

