###  JDK8 中好用的方法  

### 一、 集合
#### 1. removeIf()
* `boolean removeIf(Predicate<? super E> filter)`
* 根据条件删除集合中的对象

```
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
list.removeIf(n -> (n % 2 == 0));
list.forEach(System.out::println);  // 1、3、5
```

### 二、 Map
```
Map<String, Integer> map = new HashMap<>();
map.put("age", 18);
```

#### 1. forEach() 遍历
`void forEach(BiConsumer<? super K, ? super V> action)`

```
map.forEach((key, val) -> {
    System.out.println(key + ":" + val);
});
```


#### 2. getOrDefault() 获取值
* `V getOrDefault(Object key, V defaultValue)`
* 用于获取指定`key`对应的值，如果`key`不存在，则返回一个默认值

```
Integer v1 = map.getOrDefault("age", 20);   // 18
Integer v2 = map.getOrDefault("size", 18);  // 18
```


#### 3. putIfAbsent()  设置值
* `V putIfAbsent(K key, V value)`
* 当指定`key`不存在时，则设置其 value

```
Integer v1 = map.compute("age", (key, val) -> val + 1);           // 19

Integer v = map.computeIfPresent("age", (key, val) -> val + 1);   // 19
Integer v2 = map.computeIfPresent("age2", (key, val) -> val + 1); // null

Integer v = map.computeIfAbsent("age", key -> 3);               // 18
Integer v3 = map.computeIfAbsent("age3", key -> 33);            // 33
```

#### 4. replace(K, V)、replace(K, V, V)、replaceAll() 替换值
* `V replace(K key, V value)`    
  * 键存在则替换值，不存在则无操作 --- 返回旧值
* `boolean replace(K key, V oldValue, V newValue)`
  * 键存在且值为`oldValue`时，则替换值，否则无操作 --- 成功替换返回 true，否则 false
* `void replaceAll(BiFunction<? super K, ? super V, ? extends V> function)`
  * 根据传入的函数式接口，替换所有键对应的值
  
```
Integer v1 = map.replace("age", 20);    // 18
Integer v2 = map.replace("size", 18);   // null
System.out.println(map.get("age"));     // 20

boolean result1 = map.replace("age", 20, 21);    // false
boolean result2 = map.replace("age", 18, 22);    // true
boolean result3 = map.replace("size", 18, 20);   // false
System.out.println(map.get("age"));    // 22

map.replaceAll((key, val) -> val + 1);
```



#### 5. compute()、 computeIfPresent()、 computeIfAbsent()  计算并设置新值
* `V compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`
  * 键存在则进行计算，并将计算结果设置为新值  ---返回新值
  * 键不存在抛出异常
* `V computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`
  * 键存在则进行计算，并将计算结果设置为新值，返回新值
  * 键不存在，无操作，返回 null
* `V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)`
  * 键存在，无操作，返回旧值
  * 键不存在则进行计算，并将计算结果设置为新值，返回新值
  
```
Integer v1 = map.compute("age", (key, val) -> val + 1);           // 19

Integer v = map.computeIfPresent("age", (key, val) -> val + 1);   // 19
Integer v2 = map.computeIfPresent("age2", (key, val) -> val + 1); // null

Integer v = map.computeIfAbsent("age", key -> 3);               // 18
Integer v3 = map.computeIfAbsent("age3", key -> 33);            // 33
```

