###  Flowable 用户、用户组
操作用户、用户组的服务是 IdentityService

### 一、运行时变量分类
用户、用户组涉及的表在 ACT_ID_ 开头的表中，常用的几个如下：

| 表名                    | 作用          | 表字段                            |
|-----------------------|-------------|--------------------------------|
| `ACT_ID_USER`         | 用户表         | `ID_、FIRST_、LAST_、EMAIL_、PWD_` |
| `ACT_ID_GROUP`        | 用户组信息表      | `ID_、NAME_、TYPE_`              |
| `ACT_ID_MEMBERSHIP`   | 人与组关系表      | `USER_ID_、GROUP_ID_`           |



### 二、用户  ACT_ID_USER
#### 1. 创建用户
```
User user = identityService.newUser("user_1");
user.setFirstName("张");
user.setLastName("三");
user.setEmail("666@qq.com");
identityService.saveUser(user);
```

#### 2. 删除用户
```
identityService.deleteUser("user_1");
```

#### 3. 查询用户
```
List<User> list = identityService.createUserQuery().list();
list.forEach(user -> System.out.println(user.getId()));
```


### 三、用户组  ACT_ID_GROUP
#### 1. 创建用户组
```
Group group = identityService.newGroup("group_1");
group.setName("开发组");
identityService.saveGroup(group);
```

#### 2. 删除用户组
```
identityService.deleteGroup("group_1");
```

#### 3. 查询用户组
```
// 查询所有
List<Group> list1 = identityService.createGroupQuery().list();
list1.forEach(group -> System.out.println(group.getName()));
// 通过用户组id查询
Group group = identityService.createGroupQuery().groupId("group_1").singleResult();
System.out.println(group.getName());
// 通过用户id查询
Group group2 = identityService.createGroupQuery().groupMember("user_1").singleResult();
System.out.println(group2.getName());
```


### 四、用户、用户组关联  ACT_ID_MEMBERSHIP
用户组与用户是一对多关系

```
Group group = identityService.createGroupQuery().groupId("group_1").singleResult();
List<User> list = identityService.createUserQuery().list();
for (User user : list) {
    identityService.createMembership(user.getId(),group.getId());
}
```
