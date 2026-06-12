# 第 T27 课 · SQLite 给小工具配本地数据库

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:SQLite 官方文档 · [sqlite.org/docs.html](https://www.sqlite.org/docs.html) · [sqlite.org/cli.html](https://www.sqlite.org/cli.html) · [github.com/sqlite/sqlite](https://github.com/sqlite/sqlite)

---

## 📖 你要学会什么

学完这一课,你能给自己写的小工具配上一个真正的本地数据库——建表、插数据、查数据——而不是每次运行都重新读 CSV 或 JSON 文件,数据丢了重来。

想象你是个快递小哥,每天要记录几十个包裹的状态。如果你把记录写在随手的纸条上,纸条一丢信息就没了;如果你每次都把所有包裹信息写进一个大 Excel 表,找起来又慢。SQLite 给你的感觉是:**一个装在口袋里的迷你档案柜**——整个数据库就是一个文件,放在哪里都行,查询却是正经的 SQL——快、准、不丢。

SQLite 是全球用量最大的数据库引擎(没有之一),它不需要服务器进程,整个数据库就是一个 `.db` 文件。手机 App、浏览器、微信本地存储——背后都是 SQLite。Python 标准库自带 `sqlite3` 模块,装了 Python 就能用,一行 `import` 都不需要额外安装。

**官方资料:**
- 官方文档总览: [sqlite.org/docs.html](https://www.sqlite.org/docs.html)
- 命令行工具手册: [sqlite.org/cli.html](https://www.sqlite.org/cli.html)
- SQL 语法参考: [sqlite.org/lang.html](https://www.sqlite.org/lang.html)
- Python sqlite3 模块: [docs.python.org/3/library/sqlite3.html](https://docs.python.org/3/library/sqlite3.html)

---

## 🧠 核心原则

1. **整个数据库就是一个文件,移动复制都没事。** `mydata.db` 就是你的数据库,`cp mydata.db mydata_backup.db` 就是备份——比 MySQL 那种"服务器+配置文件+数据目录"的架子轻太多了。

2. **用完记得 `conn.close()` 或用 `with` 语句。** SQLite 写操作后数据在内存里,没提交(`commit`)就丢了;连接没关(`close`)可能锁住文件。用 `with sqlite3.connect(...)` 的上下文管理器写法,关闭和提交都自动处理,是最省心的姿势。

3. **查询参数用 `?` 占位,不要拼字符串。** `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))` 是正确写法;`"SELECT * FROM users WHERE name = '" + name + "'"` 是 SQL 注入的温床——哪怕是给自己用的小工具也别养坏习惯。

4. **SQLite 适合"单机小数据"。** 几万行、几十万行都没问题;并发写入多的场景(多个进程同时写)或者数据超过几 GB 时,该考虑 PostgreSQL/MySQL 了。作为 agent 工具的本地存储,SQLite 绰绰有余。

5. **`PRAGMA journal_mode=WAL` 一行让并发更稳。** 如果你的工具偶尔需要同时读写,加上这行配置,SQLite 的写操作就不会锁住读操作——性能和稳定性都好很多。

---

## 🛠 操作要点

### 安装

**Python 版(推荐,零安装):** Python 3.x 标准库自带 `sqlite3`——直接 `import sqlite3` 就能用,**不需要安装任何东西**。

**命令行客户端(可选):**
> ⚠️ 命令行客户端安装须征得主人确认。

```bash
# macOS(Homebrew)
brew install sqlite

# Linux(Debian/Ubuntu)—— 通常系统自带,不需要额外装
sudo apt install sqlite3

# Windows:在 https://sqlite.org/download.html 下载 sqlite-tools-win 压缩包,解压即用
```

> 🇨🇳 **中国用户提示:** SQLite 官网 `sqlite.org` 在国内可正常访问,下载无需科学上网。Python 的 `sqlite3` 模块无需安装,零门槛。

### 最小可运行示例(Python,无需安装任何依赖)

```python
import sqlite3

# 1. 连接(文件不存在会自动创建)
conn = sqlite3.connect("/tmp/myapp.db")
cursor = conn.cursor()

# 2. 建表(不存在才建)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        title   TEXT NOT NULL,
        status  TEXT DEFAULT 'todo',
        created TEXT DEFAULT (datetime('now', 'localtime'))
    )
""")

# 3. 插入数据
cursor.execute("INSERT INTO tasks (title) VALUES (?)", ("买咖啡",))
cursor.execute("INSERT INTO tasks (title) VALUES (?)", ("写报告",))
cursor.execute("INSERT INTO tasks (title, status) VALUES (?, ?)", ("回邮件", "done"))
conn.commit()

# 4. 查询全部
print("=== 所有任务 ===")
for row in cursor.execute("SELECT id, title, status FROM tasks"):
    print(row)

# 5. 条件查询
print("\n=== 未完成任务 ===")
for row in cursor.execute("SELECT title FROM tasks WHERE status = ?", ("todo",)):
    print(row[0])

# 6. 关闭连接
conn.close()
```

**期望输出:**
```
=== 所有任务 ===
(1, '买咖啡', 'todo')
(2, '写报告', 'todo')
(3, '回邮件', 'done')

=== 未完成任务 ===
买咖啡
写报告
```

### 常用 SQL 速查

```sql
-- 建表
CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,
    score INTEGER DEFAULT 0
);

-- 插入
INSERT INTO users (name, email, score) VALUES ('小明', 'xm@example.com', 88);

-- 查全部
SELECT * FROM users;

-- 条件查询
SELECT name, score FROM users WHERE score > 80;

-- 更新
UPDATE users SET score = 95 WHERE name = '小明';

-- 删除
DELETE FROM users WHERE score < 60;

-- 计数
SELECT COUNT(*) FROM users;

-- 排序(分数倒序)
SELECT name, score FROM users ORDER BY score DESC;

-- 限制条数(取前 3)
SELECT name FROM users ORDER BY score DESC LIMIT 3;
```

### Python sqlite3 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 连接/创建数据库 | `conn = sqlite3.connect("data.db")` |
| 内存数据库(临时) | `conn = sqlite3.connect(":memory:")` |
| 执行 SQL | `cursor.execute("SQL语句", (参数,))` |
| 批量插入 | `cursor.executemany("INSERT ...", list_of_tuples)` |
| 提交写操作 | `conn.commit()` |
| 取一行 | `cursor.fetchone()` |
| 取所有行 | `cursor.fetchall()` |
| 结果转字典 | `conn.row_factory = sqlite3.Row` |
| 关闭连接 | `conn.close()` |
| 上下文管理器 | `with sqlite3.connect("data.db") as conn:` |

### 命令行客户端基本用法

```bash
# 打开数据库(文件不存在会创建)
sqlite3 /tmp/myapp.db

# 在 sqlite3 提示符下:
.tables             # 列出所有表
.schema tasks       # 查看 tasks 表结构
SELECT * FROM tasks;
.mode column        # 更好看的列模式
.headers on         # 显示列名
.quit               # 退出
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 Python sqlite3 建一个"笔记本"数据库,完成建表、插入、查询三步,附上真实命令和输出。**

测试数据内嵌,直接运行即可(无需联网,无需安装额外依赖):

```python
# 保存为 /tmp/notebook_test.py 并运行
import sqlite3

DB_PATH = "/tmp/notebook.db"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row   # 结果可以用列名访问
cursor = conn.cursor()

# 建表
cursor.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        tag     TEXT,
        content TEXT NOT NULL
    )
""")

# 插入测试数据
notes = [
    ("工作", "明天 10 点开周会"),
    ("工作", "提交 Q2 报告"),
    ("生活", "买菜:西红柿、鸡蛋"),
    ("学习", "复习 SQLite 课程"),
]
cursor.executemany("INSERT INTO notes (tag, content) VALUES (?, ?)", notes)
conn.commit()

# 查询一:所有笔记
print("=== 全部笔记 ===")
for row in cursor.execute("SELECT id, tag, content FROM notes"):
    print(f"[{row['id']}] [{row['tag']}] {row['content']}")

# 查询二:只看工作笔记
print("\n=== 工作笔记 ===")
for row in cursor.execute("SELECT content FROM notes WHERE tag = ?", ("工作",)):
    print("-", row["content"])

# 查询三:统计各标签数量
print("\n=== 标签统计 ===")
for row in cursor.execute("SELECT tag, COUNT(*) as cnt FROM notes GROUP BY tag"):
    print(f"{row['tag']}: {row['cnt']} 条")

conn.close()
print("\n数据库文件:", DB_PATH)
```

**验证标准:**
- 全部笔记输出 4 条,`id` 从 1 到 4
- 工作笔记输出 2 条
- 标签统计输出 3 行(工作2/生活1/学习1)
- `/tmp/notebook.db` 文件存在(用 `ls -lh /tmp/notebook.db` 验证)

**沉淀技能卡:** 把 SQL 速查 + Python sqlite3 常用操作沉淀成 `skills/sqlite.md`。

> ⚠️ **安全边界:** Python `sqlite3` 模块零安装,可直接运行,非常安全。注意:**不要把含隐私数据的 .db 文件提交到 git 仓库**——在 `.gitignore` 里加上 `*.db`。

---

## 🎓 过关标准

- [ ] 你用 Python 成功创建了一个 `.db` 文件并建了表
- [ ] 你用 `executemany` 批量插入了多条数据
- [ ] 你完成了条件查询和聚合统计(GROUP BY)
- [ ] 你能说清楚"为什么查询参数要用 `?` 而不是字符串拼接"
- [ ] 你知道什么时候 SQLite 不够用、该换更大的数据库
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T28 课。
