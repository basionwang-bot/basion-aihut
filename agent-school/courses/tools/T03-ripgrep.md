# 第 T03 课 · ripgrep(rg)大仓库秒级搜索

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★☆☆ ｜ 源头:ripgrep 官方仓库 · [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) · [GUIDE.md](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)

---

## 📖 你要学会什么

学完这一课,你能在几秒内从几十万行代码里找到你要的任何东西——函数名、报错信息、配置项——而不是用 `grep` 等几十秒、或者漫无目的地一个文件一个文件翻。

想象你进了一座巨大的图书馆,有几十万本书。普通 `grep` 是"请图书管理员挨本翻",慢且不筛选;ripgrep 是**自带 GPS 的扫描仪**:它知道哪些架子是"存档区不用看"(`.gitignore` 里的文件)、哪些书是"装饰用的不是文字书"(二进制文件),自动跳过,只扫该扫的——所以快得多。

ripgrep(命令是 `rg`)是用 Rust 写的行搜索工具,速度是传统 `grep` 的 5~100 倍,天然支持正则表达式、尊重 `.gitignore`、自动跳过二进制文件。

**官方资料:**
- GitHub 仓库: [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)
- 使用指南: [github.com/BurntSushi/ripgrep/blob/master/GUIDE.md](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)

---

## 🧠 核心原则

1. **默认是智能的,不用调。** `rg 关键词` 直接跑——它会自动跳过 `.gitignore` 里的文件、跳过 `node_modules`、跳过二进制文件。大多数情况不需要加任何参数。

2. **正则表达式是你的乘法器。** `rg 'def.*login'` 能找到所有以 `def ` 开头、名字含 `login` 的函数定义;`rg '\berror\b'` 只匹配完整的 `error` 单词而不是 `errors`。学几个常用正则,搜索能力翻倍。

3. **按文件类型过滤是救命技。** 一个大仓库里可能有 Python、JS、CSS、JSON 混在一起,`rg -t py '关键词'` 只搜 Python 文件,干净精准。`rg --type-list` 查看所有支持的类型。

4. **输出是可以被程序读的。** `rg --json` 输出 JSON 格式结果,方便 agent 解析;`rg -l` 只输出文件名,方便批量处理。

5. **不懂就问 `--help`。** `rg --help` 输出极其详细的文档,`rg -h` 是简化版。在工具目录里先 `rg --help | head -50` 看看有什么用。

---

## 🛠 操作要点

### 安装

```bash
# macOS(Homebrew)
brew install ripgrep

# Linux(Debian/Ubuntu)
sudo apt install ripgrep

# Linux(用 cargo 从源码装,需先装 Rust)
cargo install ripgrep

# Windows(WinGet)
winget install BurntSushi.ripgrep.MSVC
```

> 🇨🇳 **中国用户提示:** `brew install ripgrep` 和 `apt install ripgrep` 在国内一般可以直接用(Homebrew 有镜像,apt 走国内源)。如果用 `cargo install`,Rust 的 crates.io 可能需要配置国内镜像(字节跳动或清华源均可)。

### 基本用法

```bash
# 在当前目录递归搜索"TODO"
rg TODO

# 搜索特定目录
rg TODO src/

# 搜索特定文件
rg TODO src/main.py

# 忽略大小写
rg -i error

# 显示行号(默认已显示)
rg -n 'function login'
```

### 按文件类型搜索

```bash
# 只搜 Python 文件
rg -t py 'import requests'

# 只搜 JavaScript 文件
rg -t js 'console.log'

# 排除某种类型
rg -T json 'api_key'

# 查看所有支持的类型名
rg --type-list
```

### 正则表达式用法

```bash
# 找所有 def 开头的函数,函数名含 "user"
rg 'def \w*user\w*'

# 找引号里的 email 地址(简单版)
rg '[\w.]+@[\w.]+\.\w+'

# 只匹配完整单词 error,不匹配 errors
rg '\berror\b'

# 找以 TODO 或 FIXME 开头的注释
rg '# (TODO|FIXME)'
```

### 控制输出

```bash
# 只输出文件名(不显示匹配内容)
rg -l 'api_key'

# 显示匹配行的上下 3 行
rg -C 3 'raise Exception'

# 只显示匹配的部分(不是整行)
rg -o '\d{3}-\d{4}'

# 输出 JSON 格式(供程序解析)
rg --json 'TODO' | head -20

# 统计每个文件的匹配数
rg -c 'import'
```

### 速查表

| 想干嘛 | 命令 |
|--------|------|
| 找关键词 | `rg 关键词` |
| 忽略大小写 | `rg -i 关键词` |
| 只搜某目录 | `rg 关键词 src/` |
| 只搜 Python 文件 | `rg -t py 关键词` |
| 只输出文件名 | `rg -l 关键词` |
| 显示上下文 | `rg -C 3 关键词` |
| 显示行号 | `rg -n 关键词` |
| 搜索隐藏文件 | `rg --hidden 关键词` |
| 不跳过 .gitignore | `rg -u 关键词` |
| 完全不过滤 | `rg -uuu 关键词` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 `rg` 在一个真实代码仓库里完成 3 次定位任务,每次记录命令和真实输出。**

具体步骤(在 `/home/user/basion-aihut` 或任意有代码的目录下跑):

1. **任务一:找所有 TODO/FIXME**
   ```bash
   rg -n '(TODO|FIXME)' --type-list | head -5  # 先看支持哪些类型
   rg -n '(TODO|FIXME)'
   ```
   记录:输出了哪些文件、哪些行?

2. **任务二:按文件类型搜索**
   ```bash
   # 找所有 Markdown 文件里含"agent"的行
   rg -t md -i 'agent' -l
   ```
   记录:找到了几个文件?

3. **任务三:用正则表达式找函数定义**
   ```bash
   # 找所有 Python 函数定义
   rg -t py 'def \w+\('
   ```
   记录:输出前 10 行的真实内容。

4. **写出验证标准**:
   - 每条命令退出码为 0(有匹配)或 1(无匹配,但不是报错)
   - 输出格式为 `文件名:行号:内容`
   - 三个任务均有真实输出(不是空)

5. **沉淀技能卡**:把以上速查表 + 最常用的 3 个正则模式沉淀成 `skills/ripgrep.md`。

> ⚠️ **安全边界:** `rg` 是只读搜索工具,不会修改任何文件,安全性极高。唯一要注意的是:**不要把搜索结果(含代码、密钥)直接粘贴到公开频道**——尤其是搜 `api_key`、`password`、`secret` 这类敏感词时,输出要本地留存,不要外传。

---

## 🎓 过关标准

- [ ] 你跑过 3 个不同的 `rg` 命令并附上真实输出(不是手写的"大概是这样")
- [ ] 你用过至少 1 次 `-t` 类型过滤 和 1 次正则表达式
- [ ] 你能说清楚 `rg -l` 和 `rg -n` 的区别
- [ ] 你理解为什么 `rg` 比普通 `grep` 快(`.gitignore` 过滤、跳过二进制)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
