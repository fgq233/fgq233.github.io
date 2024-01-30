### Jenkins + Gitlab  + Maven 自动构建 jar 包
### 一、新建 Item
#### 1. 新建 Item
* 构建一个maven项目
* 配置
  * 源码管理，
    * 选择git，填入gitlab仓库ssh地址
    * 指定分支
  * Pre Steps 前置步骤
  * Bulid，项目 pom.xml 路径配置
  * Post Steps 后置步骤

