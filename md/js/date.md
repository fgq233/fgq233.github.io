### JS 日期 Date

#### 1. 创建

```js
// 无参：当前日期
var now = new Date();
// 带参：日期字符串、具体年月日时分秒、毫秒数
var date1 = new Date('2019-01-01 12:00:00');    
var date2 = new Date(2019, 0, 1, 12, 0, 0);    // 月0-11
var date3 = new Date(2019, 0, 1);              // 月0-11
var date4 = new Date(1546315200000);
```

#### 2.获取、设置日期信息

```js
var now = new Date();

now.getFullYear();       // 年，yyyy
now.getMonth() + 1;      // 月
now.getDate();           // 日
now.getDay();            // 星期，0-6 代表周日-周1、2、3、4、5、6
now.getHours();          // 时，0-23
now.getMinutes();        // 分，0-59
now.getSeconds();        // 秒，0-59
now.getMilliseconds();   // 毫秒

now.setFullYear(2019);       
now.setMonth(0);      
now.setDate(1);           
now.setHours(12);          
now.setMinutes(0);        
now.setSeconds(0);        
now.setMilliseconds(0);   
```

#### 3. 距离 1970.1.1 的毫秒数

```js
var now = new Date();

// 获取毫秒
now.valueOf();
now.getTime();
Date.parse(now)
Date.now();    // 当前时间距离 1970.1.1 的毫秒数

// 设置毫秒,改变原日期对象
now.setTime(0);  // 1970.1.1
```


