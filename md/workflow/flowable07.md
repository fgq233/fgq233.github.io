###  Flowable 流程变量
**流程变量**是一个key-value的键值对数据，在流程实例运行过程中使用

### 一、运行时变量分类
* 运行时的变量存入`act_ru_variable`表中，在流程实例结束时，变量删除，主要分为3个范围
* 流程实例 > 执行实例 > 任务实例
  * 流程实例变量：和流程实例`processInstanceId`绑定，全程可查询
  * 执行实例变量：和执行`executionId`绑定，处于该执行流程可查询
  * 任务实例变量：
    * 全局的与`executionId`绑定，处于该执行流程可查询
    * 局部的与`taskId`绑定，处于该任务环节可查询


### 二、变量的设置
* RuntimeService设置流程实例变量，和流程实例`processInstanceId`绑定
  * `ProcessInstance startProcessInstanceById(String processDefinitionId, Map<String, Object> variables);`  
  * `ProcessInstance startProcessInstanceByKey(String processDefinitionKey, Map<String, Object> variables);`
  
* RuntimeService设置执行实例变量，和执行`executionId`绑定
  * `void setVariable(String executionId, String variableName, Object value);`    
  * `void setVariables(String executionId, Map<String, ? extends Object> variables);`    
  * `void setVariableLocal(String executionId, String variableName, Object value);`  
  * `void setVariablesLocal(String executionId, Map<String, ? extends Object> variables);` 
  
* TaskService设置任务实例变量，在流程实例**处于该任务环节时**，才可以添加变量，不带Local的与`executionId`绑定，带Local的与`taskId`绑定
  * `void setVariable(String taskId, String variableName, Object value);`  
  * `void setVariables(String taskId, Map<String, ? extends Object> variables);`  
  * `void setVariableLocal(String taskId, String variableName, Object value);`  
  * `void setVariablesLocal(String taskId, Map<String, ? extends Object> variables);`  




### 三、变量的获取
* ProcessInstance 获取变量
  * `Map<String, Object> getProcessVariables();`
  
* RuntimeService 获取变量，需要传入 `executionId`
  * `Map<String, Object> getVariables(String executionId);`
  * `Map<String, Object> getVariablesLocal(String executionId);`
  * `Map<String, Object> getVariables(String executionId, Collection<String> variableNames);`
  * `Map<String, Object> getVariablesLocal(String executionId, Collection<String> variableNames);`
  * `Object getVariable(String executionId, String variableName);`
  * `Object getVariableLocal(String executionId, String variableName);`

* TaskService 在流程实例**处于该任务环节时**，可以获取变量，需要传入 `taskId`
  * `Object getVariable(String taskId, String variableName);`
  * `Object getVariableLocal(String taskId, String variableName);`
  * `Map<String, Object> getVariables(String taskId);`
  * `Map<String, Object> getVariablesLocal(String taskId);`



### 四、历史变量
所有添加过的变量，都可以在`act_hi_varinst`变量历史表中找到，使用`HistoryService`可以查询出来

```
List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery()
        .processInstanceId("35c4d9d8-fa68-11ee-af27-00ff306296e3")
        .orderByVariableName()
        .desc()
        .list();
for (HistoricVariableInstance instance : list) {
    System.out.println(instance.getVariableName() + ":" + instance.getValue());
}
```
