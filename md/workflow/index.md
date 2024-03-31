###  JBPM、Activiti、Flowable

#### 1. 发展历史
![](https://fgq233.github.io/imgs/workflow/flow1.png)

* Activiti和Flowable都是来自于一个叫JBPM的开源工作流
* 在早期Jboss发行JBPM4的时候，其中一个核心人员离职，加入了Alfresco(Activiti所在的公司)，在同一年发布了Activiti的第一个版本即Activiti5.0.alpha1
* 这个版本号直接从5.0开始，表示其为携带了JBPM4的所有特性，正式叫板JPBM4
* JBPM4当时也是被使用的最广的一个版本之一，同一年，Jboss对JBPM4进行了重构，使用了自己公司新研发的一套规则引擎Drools进行重构，将JBPM4升级到了JBPM5
* 国内当时软件部署大部分基于Tomcat上，JBoss所用甚少，故JBPM后续版本在国内占据市场远远不如Activiti
* Activiti就一直在5.0这个版本一直迭代开发，
* Activiti的创作者，又因为和合作伙伴关系闹的不开心，再次上演了离家出走，先后开办了Camunda和Flowable
* Flowable在开办之初，比Activiti当初直接继承JBPM的版本更为直接，直接继承了他的小版本，从Flowable5.22这个版本开始，和当时的Activiti的小版本一致


#### 2. 主流 Flowable6 与 Activiti7
* 当前微服务盛行，Flwoable和Activiti都推出了基于SpringBoot所做的 Starter来支持微服务
* 同时推出 docker镜像，并对Jenkins、Kubernates做了良好的支持


| 版本           | JDK要求   | SpringBoot 要求 |
|--------------|---------|---------------|
| Flowable6    | JDK 8+  | SpringBoot2+  |
| Activiti7    | JDK 11+ | SpringBoot3+  |
| Flowable7    | JDK 17+ | SpringBoot3+  |
