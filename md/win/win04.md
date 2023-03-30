### git 清除大文件
#### 1. 重写commit，删除目标
```
语法
git filter-branch --force --prune-empty --index-filter 'git rm -rf --cached --ignore-unmatch  目标' --tag-name-filter cat -- --all

示例
git filter-branch --force --prune-empty --index-filter 'git rm -rf --cached --ignore-unmatch  assert' --tag-name-filter cat -- --all
git filter-branch --force --prune-empty --index-filter 'git rm -rf --cached --ignore-unmatch  assert/666.mp3' --tag-name-filter cat -- --all
```

目标可以是文件、文件夹


#### 2. 报错
```
报错
Cannot rewrite branches: Your index contains uncommitted changes.

解决
git stash
```

解决之后，重新执行第一步


#### 3. push
```
git push --force --all
```

#### 4. 清理和回收空间
```
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
```