### Exception 详细信息获取

```
public static String exception1(Exception ex) {
    StringBuilder sb = new StringBuilder();
    StackTraceElement[] trace = ex.getStackTrace();
    for (StackTraceElement s : trace) {
        sb.append("\tat ").append(s).append("\r\n");
    }
    return sb.toString();
}

public static String exception2(Exception ex) {
    StringWriter sw = new StringWriter();
    try (PrintWriter pw = new PrintWriter(sw)) {
        ex.printStackTrace(pw);
    }
    return sw.toString();
}

public static String exception3(Exception ex) {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    try (PrintStream ps = new PrintStream(out)) {
        ex.printStackTrace(ps);
    }
    return out.toString();
}
```
