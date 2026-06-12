# 第 T29 课 · cron 让任务按时自动跑

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:GNU cron 手册 · [man7.org/linux/man-pages/man5/crontab.5.html](https://man7.org/linux/man-pages/man5/crontab.5.html) · crontab.guru · [crontab.guru](https://crontab.guru)

---

## 📖 你要学会什么

学完这一课,你能写一条 crontab 表达式,让一个脚本"每天早上 8 点自动运行"、"每隔 15 分钟检查一次"、"每周一凌晨做备份"——而不是每次都靠自己手动触发。

想象你有一个尽职的助手,你告诉他:"每天早上 8 点,帮我把今天的天气报告发到我邮箱。"你说完就走了,他从此每天 8 点准时去做,你不用再操心。cron 就是这个**永不迟到的定时助手**——你把任务和时间写进 crontab,之后什么都不用管,到点自动跑。

cron 是 UNIX 系统内置的定时任务调度器,几乎所有 Linux 服务器和 macOS 系统都自带。不需要安装,不需要写代码,只需要一个配置文件(crontab)告诉它"什么时候跑什么命令"。

**官方资料:**
- crontab 手册: [man7.org/linux/man-pages/man5/crontab.5.html](https://man7.org/linux/man-pages/man5/crontab.5.html)
- 在线语法验证器: [crontab.guru](https://crontab.guru) (强烈推荐,所见即所得)
- systemd timer 现代替代: [systemd.io/TIME_FORMAT/](https://systemd.io/TIME_FORMAT/)

---

## 🧠 核心原则

1. **cron 表达式是五个数字,从左到右:"分 时 日 月 周"。** 记这个口诀:**"分时日月周"**。`30 8 * * *` 意思是"每天 8:30",`0 0 * * 1` 意思是"每周一 00:00"。五个字段,一个不能少。

2. **`*` 是"每一个","每隔 N" 用 `*/N`。** `*` 在"分"字段意思是"每分钟";`*/15` 在"分"字段意思是"每 15 分钟"。`*/6` 在"小时"字段是"每 6 小时一次"。

3. **cron 跑的环境和你的终端环境不一样,路径要写全。** cron 执行命令时,$PATH 非常有限,很多命令找不到。要么写**绝对路径**(`/usr/bin/python3 /home/user/script.py`),要么在 crontab 顶部显式设 `PATH=`。

4. **所有输出默认发邮件(没邮件就丢掉),重定向到文件才能留日志。** `>> /home/user/cron.log 2>&1` 把标准输出和错误输出都追加到日志文件——这行几乎是所有 cron 任务的必备尾缀。

5. **先测试脚本再加进 cron。** cron 出错时你很难第一时间发现。做法:先手动运行脚本确认没问题,再加进 crontab。刚加完后等到下个触发时间,检查日志文件确认跑了。

---

## 🛠 操作要点

### crontab 基本操作

> ⚠️ **操作须知:修改 crontab 会影响系统定时任务。查看(只读)可以直接做;增删改须征得主人确认。**

```bash
# 查看当前用户的 crontab(只读,安全)
crontab -l

# 编辑 crontab(打开编辑器,修改后保存才生效)
crontab -e

# 删除所有 crontab(危险!确认前不要跑)
crontab -r
```

### cron 表达式格式

```
┌───────────── 分钟 (0-59)
│ ┌─────────── 小时 (0-23)
│ │ ┌───────── 日期 (1-31)
│ │ │ ┌─────── 月份 (1-12)
│ │ │ │ ┌───── 星期几 (0-7,0和7都是周日)
│ │ │ │ │
* * * * *  要执行的命令
```

### 常用时间表达式速查(内嵌,可验证)

| 含义 | cron 表达式 | 人话解释 |
|------|-------------|----------|
| 每分钟 | `* * * * *` | 每分钟都跑一次 |
| 每 5 分钟 | `*/5 * * * *` | 0,5,10,15...分时跑 |
| 每 15 分钟 | `*/15 * * * *` | 0,15,30,45分时跑 |
| 每天凌晨 2 点 | `0 2 * * *` | 每天 02:00 |
| 每天早上 8:30 | `30 8 * * *` | 每天 08:30 |
| 每周一 00:00 | `0 0 * * 1` | 周一凌晨 |
| 每月 1 日 09:00 | `0 9 1 * *` | 每月第一天 9 点 |
| 工作日(周一到周五)09:00 | `0 9 * * 1-5` | 周一到周五 9 点 |
| 每小时 | `0 * * * *` | 每整点 |

### 一个完整 crontab 示例

```bash
# 在 crontab -e 里写入以下内容:

# 设置路径(解决"找不到命令"问题)
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# 每天 07:00 运行备份脚本,日志写入 backup.log
0 7 * * * /home/user/scripts/backup.sh >> /home/user/logs/backup.log 2>&1

# 每 15 分钟检查一次服务状态
*/15 * * * * /usr/bin/python3 /home/user/scripts/check_service.py >> /home/user/logs/check.log 2>&1

# 每周一 00:30 清理临时文件
30 0 * * 1 /bin/rm -rf /tmp/myapp_cache/* >> /home/user/logs/cleanup.log 2>&1
```

### 用 Python 脚本做"有时间戳的日志"(方便调试)

```python
#!/usr/bin/env python3
# 保存为 /home/user/scripts/hello_cron.py
import datetime

with open("/tmp/cron_hello.log", "a") as f:
    f.write(f"[{datetime.datetime.now()}] cron 触发成功!\n")
```

对应的 crontab 条目(每分钟触发一次,用于快速验证):
```
* * * * * /usr/bin/python3 /home/user/scripts/hello_cron.py
```

验证:等 1 分钟后 `cat /tmp/cron_hello.log`,应看到带时间戳的行。

### macOS 上的注意事项

macOS 除了 cron 还有 `launchd`(苹果自家调度器)。对于简单定时任务,macOS 上用 cron 完全可以;但要注意 macOS 系统在睡眠时 cron 不会触发——如果需要机器休眠时也能跑,要用 `launchd`。

### 中国服务器常见坑

- **时区问题:** cron 使用系统时区。国内服务器通常已设置 CST(东八区),但云服务器(如阿里云 ECS)默认可能是 UTC——如果你写 `0 8 * * *` 想让它 8 点跑,却在下午 4 点才跑,就是时区偏了。用 `timedatectl` 查时区,用 `TZ=Asia/Shanghai` 在脚本里设。

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个定时脚本并写出对应的 crontab 条目,附验证方案(可跑验证脚本,但新增 crontab 条目须主人确认)。**

**第一步:写测试脚本(只读本地文件,安全)**

```bash
cat > /tmp/cron_test_script.py << 'EOF'
#!/usr/bin/env python3
"""
每次运行:追加一行带时间戳的日志
"""
import datetime

LOG_FILE = "/tmp/cron_test.log"
now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

with open(LOG_FILE, "a") as f:
    f.write(f"[{now}] 定时任务触发成功\n")

print(f"已写入日志: {LOG_FILE}")
EOF
chmod +x /tmp/cron_test_script.py
```

**第二步:手动验证脚本能跑(不涉及 cron,安全)**
```bash
/usr/bin/python3 /tmp/cron_test_script.py
cat /tmp/cron_test.log
# 期望:看到一行带时间戳的记录
```

**第三步:写出 crontab 条目(仅方案,不实际安装)**

给出三种场景的 crontab 条目:

```bash
# 场景一:每分钟触发(调试用)
* * * * * /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1

# 场景二:每天早 8:30 触发(实际工作场景)
30 8 * * * /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1

# 场景三:每周一凌晨做备份
0 1 * * 1 /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1
```

**第四步:验证语法(零副作用,安全)**
```bash
# 用 crontab.guru 在线验证(https://crontab.guru)
# 或者用 Python 解释你写的表达式含义

python3 -c "
exprs = {
    '* * * * *':   '每分钟',
    '30 8 * * *':  '每天 08:30',
    '0 1 * * 1':   '每周一 01:00',
    '*/15 * * * *':'每 15 分钟',
}
for expr, meaning in exprs.items():
    print(f'{expr}  →  {meaning}')
"
```

**验证标准:**
- 手动运行脚本成功,`/tmp/cron_test.log` 有时间戳记录
- 能正确解释每条 crontab 表达式的触发时间
- 知道需要写绝对路径、重定向日志的原因

**沉淀技能卡:** 把常用时间表达式速查 + 调试方法沉淀成 `skills/cron.md`。

> ⚠️ **安全边界(重要):**
> - **只读 crontab(`crontab -l`)** 是安全的,可以直接做。
> - **新增/修改 crontab 条目** 会让脚本定期自动运行,可能产生意外副作用——**必须先征得主人确认,说清楚"这条任务会做什么、多久跑一次"**,再执行 `crontab -e`。
> - **`crontab -r`(删除所有)** 是破坏性操作,绝对不可自行执行。

---

## 🎓 过关标准

- [ ] 你写出了完整正确的五字段 crontab 表达式,并能逐字段解释
- [ ] 你手动运行了测试脚本并验证了日志写入
- [ ] 你知道 cron 任务日志为什么要加 `>> log 2>&1`
- [ ] 你能解释"为什么 cron 里要写命令的绝对路径"
- [ ] 你知道 macOS 睡眠和时区这两个常见坑
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T30 课。
