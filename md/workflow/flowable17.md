###  任务节点一些属性信息 

![](https://fgq233.github.io/imgs/workflow/flow53.png)


```
List<Task> list = taskService.createTaskQuery().list();
for (Task task : list) {
    System.out.println("任务id：" + task.getId());
    System.out.println("主键ID：" + task.getTaskDefinitionKey());
    System.out.println("环节名称：" + task.getName());
    System.out.println("办理人：" + task.getAssignee());
    System.out.println("描述信息：" + task.getDescription());
}
        
任务id：2e492c78-1837-11ef-bc61-00ff306296e3
主键ID：ID-666
环节名称：我的任务
办理人：A
描述信息：这是一段描述信息...      
```


