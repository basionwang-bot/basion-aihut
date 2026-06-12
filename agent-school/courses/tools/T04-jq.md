# 第 T04 课 · jq 把 JSON 切成你要的字段

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:jq 官方网站 · [jqlang.org](https://jqlang.org/) · [jqlang.org/manual/](https://jqlang.org/manual/) · [jqlang.org/tutorial/](https://jqlang.org/tutorial/)

---

## 📖 你要学会什么

学完这一课,你能把一坨 JSON 原料——比如 GitHub API 返回的 500 行嵌套数据——精准切出你要的那几个字段,而不是把整坨喂给 AI(浪费 token)或者手动复制粘贴(浪费时间)。

想象 JSON 是一个俄罗斯套娃,一层套一层。你想要最里面那个小人,但每次都只能把整套娃抱走。`jq` 就是那把**精准的手术刀**——告诉它"我要第三层、左边那个娃娃的右手",它就给你切出来,其他的不碰。

`jq` 是命令行 JSON 处理器,号称"JSON 的 sed"。最新版本 1.8,支持复杂的过滤、变换、聚合操作。

**官方资料:**
- 官方网站: [jqlang.org](https://jqlang.org/)
- 完整手册: [jqlang.org/manual/](https://jqlang.org/manual/)
- 入门教程: [jqlang.org/tutorial/](https://jqlang.org/tutorial/)
- GitHub 仓库: [github.com/jqlang/jq](https://github.com/jqlang/jq)

---

## 🧠 核心原则

1. **`. `(点)是"当前整个 JSON"。** 所有 `jq` 过滤都从 `.` 开始。`.name` 是取 name 字段,`.[0]` 是取数组第一个元素,`.users[].name` 是遍历 users 数组取每人的 name。就像问路——你先说"从我现在站的地方出发",然后才说"走哪条路"。

2. **管道 `|` 把操作串起来。** `.users[] | .name` 的意思是"先展开 users 数组里每一项,再从每项取 name"。jq 的管道和 shell 管道一个逻辑:上一步的输出是下一步的输入。

3. **`select` 是过滤器,不是选择器。** `.[] | select(.age > 18)` 是"遍历所有元素,留下 age 大于 18 的"。先展开、再筛、再变换——这个顺序记住了,80% 的需求都能搞定。

4. **双引号字符串插值 `"\(.field)"`。** 想把多个字段拼成一行字符串:`"\(.name) 的年龄是 \(.age) 岁"`——括号里是 jq 表达式,外面是普通字符串。

5. **`-r` 去掉结果的外层引号。** 默认输出的字符串带双引号(`"hello"`),加 `-r`(raw output)就输出纯文本(`hello`),方便接管道或写入文件。

---

## 🛠 操作要点

### 安装

```bash
# macOS(Homebrew)
brew install jq

# Linux(Debian/Ubuntu)
sudo apt install jq

# Windows(Chocolatey)
choco install jq

# Windows(WinGet)
winget install jqlang.jq
```

> 🇨🇳 **中国用户提示:** `apt install jq` 和 `brew install jq` 在国内均可直接使用,无需科学上网。Windows 用户也可在 [github.com/jqlang/jq/releases](https://github.com/jqlang/jq/releases) 下载 `.exe` 手动安装。

### 最小可运行示例

```bash
# 准备一个 JSON 文件(或用 echo 临时生成)
echo '{"name":"小明","age":25,"city":"北京"}' | jq '.'

# 取单个字段
echo '{"name":"小明","age":25}' | jq '.name'
# 输出: "小明"

# 去掉引号(-r = raw)
echo '{"name":"小明","age":25}' | jq -r '.name'
# 输出: 小明

# 从数组里取字段
echo '[{"name":"小明"},{"name":"小红"}]' | jq '.[].name'
# 输出:
# "小明"
# "小红"
```

### 常用过滤操作

```bash
# 取嵌套字段(用户的城市)
cat data.json | jq '.user.address.city'

# 取数组第一个元素
cat data.json | jq '.[0]'

# 取数组所有元素的某字段
cat data.json | jq '.[].name'

# 筛选:只留下 age > 18 的
cat data.json | jq '.[] | select(.age > 18)'

# 筛选:只留下 status 为 "open" 的
cat data.json | jq '.[] | select(.status == "open")'

# 重组成新 JSON(只保留 name 和 age)
cat data.json | jq '.[] | {name: .name, age: .age}'

# 拼字符串
cat data.json | jq -r '.[] | "\(.name) 年龄 \(.age)"'

# 统计数组长度
cat data.json | jq 'length'

# 对字段排序
cat data.json | jq 'sort_by(.age)'
```

### 和 GitHub CLI 联动(实战场景)

```bash
# 列出所有 open PR,只看编号+标题
gh pr list --json number,title,state \
  | jq -r '.[] | "\(.number)\t\(.title)"'

# 找所有作者是 "alice" 的 issue
gh issue list --json number,title,author \
  | jq -r '.[] | select(.author.login == "alice") | "\(.number) \(.title)"'

# 统计有多少个 open PR
gh pr list --json number | jq 'length'
```

### 速查表

| 想干嘛 | jq 表达式 |
|--------|-----------|
| 输出整个 JSON(美化) | `.` |
| 取字段 | `.field` |
| 取嵌套字段 | `.a.b.c` |
| 取数组所有元素 | `.[]` |
| 取第 N 个元素 | `.[N]` |
| 筛选条件 | `select(.x > 1)` |
| 重组对象 | `{a: .a, b: .b}` |
| 拼字符串 | `"\(.a) \(.b)"` |
| 去掉引号 | `-r` 标志 |
| 数组长度 | `length` |
| 按字段排序 | `sort_by(.field)` |
| 取唯一值 | `unique_by(.field)` |
| 数组转对象 | `from_entries` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 `jq` 处理一个真实的 JSON 数据集,完成 3 次数据提取操作,附上真实命令和输出。**

准备测试数据:

```bash
# 把这个 JSON 存成 test.json
cat > /tmp/test.json << 'EOF'
[
  {"name":"小明","age":22,"city":"北京","score":88},
  {"name":"小红","age":17,"city":"上海","score":95},
  {"name":"小刚","age":30,"city":"北京","score":72},
  {"name":"小丽","age":25,"city":"深圳","score":91}
]
EOF
```

完成以下 3 个任务并附上真实输出:

1. **任务一:提取所有人的名字和分数**
   ```bash
   cat /tmp/test.json | jq -r '.[] | "\(.name) 得了 \(.score) 分"'
   ```

2. **任务二:筛选出 18 岁以上的人,只保留 name 和 city**
   ```bash
   cat /tmp/test.json | jq '[.[] | select(.age >= 18) | {name, city}]'
   ```

3. **任务三:按分数排序,取第一名的名字**
   ```bash
   cat /tmp/test.json | jq -r 'sort_by(-.score) | .[0].name'
   ```

4. **写出验证标准**:
   - 任务一输出 4 行中文字符串
   - 任务二输出 3 个对象的数组(17 岁的小红被过滤掉)
   - 任务三输出 `小红`(分数最高 95)

5. **沉淀技能卡**:把速查表 + 和 `gh` 联动的命令沉淀成 `skills/jq.md`。

> ⚠️ **安全边界:** `jq` 是纯本地文本处理工具,不联网、不写文件(除非你重定向输出),非常安全。唯一注意:**不要把含密钥或隐私信息的 JSON 输出到不受控的地方**(比如贴进 AI 对话或公开 issue)。

---

## 🎓 过关标准

- [ ] 你跑过 3 个 `jq` 命令并附上了真实的命令 + 输出(不是手写的)
- [ ] 你用过 `select()` 过滤条件
- [ ] 你用过字符串插值 `"\(.field)"`
- [ ] 你能说清楚 `-r` 标志的作用(去引号)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
