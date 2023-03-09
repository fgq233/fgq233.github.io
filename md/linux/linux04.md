### vi/vim 编辑器
### 一、介绍
#### 1. 概念
* `vi/vim` 是`visual interface`的简称, 是`Linux`中的文本编辑器，类似于`Windows`中的记事本
* `vim` 是 `vi` 的加强版本，兼容 `vi` 的所有指令，更加强大

#### 2. 三种模式
`vi/vim` 编辑器有三种工作模式
* 命令模式 `Command mode`: 此模式下，不能自由进行文本编辑
* 输入模式 `Insert mode`:也就是编辑模式、插入模式，可以对文件内容进行自由编辑
* 底线命令模式 `Last line mode`，通常用于文件的保存、退出
  
  
#### 3. 模式切换
* 命令模式是个中间模式，其他两个模式和其切换，按下 ESC 键 即可
* 命令模式 》》》 输入模式，按下`i、a、o` 等键
* 命令模式 》》》 底线命令模式，按下 `:` 键

![](https://fgq233.github.io/imgs/linux/linux02.png)

#### 4. 编辑文件通常步骤
* ① `vim 文件路径`，进入命令模式
* ② 按下 `i`，进入输入模式
* ③ 编辑文件内容
* ④ 输入完成，按下 `ESC` 键 退回命令模式
* ⑤ 按下`:`键，然后回车，进入底线命令模式
* ⑥ 输入 `:wq`，保存文件并退出 `vi` 编辑器



### 二、常用按键
#### 1、命令模式 切换为 输入模式
| 按键   | 作用 |
| ------ | ---- |
|  `i` | 在当前光标位置进入`输入模式` |
|  `a` | 在当前光标位置之后进入`输入模式` |
|  `I` | 在当前行的开头进入`输入模式` |
|  `A` | 在当前行的结尾进入`输入模式` |
|  `o` | 在当前光标下一行进入`输入模式` |
|  `O` | 在当前光标上一行进入`输入模式` |

 

#### 2、命令模式按键作用 
| 按键   | 作用 |
| ------ | ---- |
|  `dd` | 删除光标所在行 |
|  `yy` | 复制当前行 |
|  `p` | 粘贴复制的内容 |
|  `u` | 撤消上一个操作 |
|  `gg` | 跳到首行|
|  `G` | 跳到尾行|
|  `u` | 撤消上一个操作 |
|  上下左右 | 控制光标位置 |

 

#### 3、退出 vi 编辑器
| 按键   | 作用 |
| ------ | ---- |
|  `:w` | 保存文件 |
|  `:w!` | 若文件为只读，强制保存文件 |
|  `:q` | 离开vi |
|  `:q!` | 不保存强制离开vi |
|  `:wq` | 保存后离开 |
|  `:wq!` | 强制保存后离开 |
