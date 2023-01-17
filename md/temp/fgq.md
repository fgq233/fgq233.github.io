### 乱七八糟
### MD 收缩语法
```
<details>
  <summary>摘要</summary>
  <pre><code>代码区域</code></pre>
</details>
```


### 目录语法
```
public static void main(String[] args) {
    try {
        File file = new File("");
        byte[] bytes = new byte[1024];
        StringBuffer sb = new StringBuffer();
        FileInputStream in = new FileInputStream(file);
        int len;
        while ((len = in.read(bytes)) != -1) {
            sb.append(new String(bytes, 0, len));
            if (sb.toString().length() == 100000) {
                sb = new StringBuffer();
            } else if (sb.toString().length() >= 100000) {
                break;
            }
        }
        System.out.println(sb.length());
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```
