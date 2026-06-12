# 第 T30 课 · rsync 可靠地同步和备份文件

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:rsync 官方手册 · [man7.org/linux/man-pages/man1/rsync.1.html](https://man7.org/linux/man-pages/man1/rsync.1.html) · [rsync.samba.org](https://rsync.samba.org)

---

## 📖 你要学会什么

学完这一课,你能用 rsync 可靠地在两个目录之间同步文件——不管是本地备份还是推到远程服务器——还会用 `--dry-run` 先预演"这次会改动什么",看清楚了再真正执行。

想象你有两个仓库:一个是你天天工作的"主仓库",一个是放在另一栋楼的"备份仓库"。你希望每次下班前让备份仓库和主仓库保持一致——但你不想每次都把所有货物搬过去,那太慢了。rsync 就是**那个只搬"变化部分"的聪明快递员**——它先盘点两边的差异,只把新增的、改动的搬过去,没变的一个字节都不动。

rsync 是 Andrew Tridgell 开发的开源同步工具,是 Linux 服务器备份的事实标准。它的"delta 传输算法"极其高效——哪怕是几 GB 的文件,只改了几行,也只传那几行,不传整个文件。

**官方资料:**
- rsync 手册: [man7.org/linux/man-pages/man1/rsync.1.html](https://man7.org/linux/man-pages/man1/rsync.1.html)
- 官方主页: [rsync.samba.org](https://rsync.samba.org)
- rsync 协议详解: [rsync.samba.org/how-rsync-works.html](https://rsync.samba.org/how-rsync-works.html)

---

## 🧠 核心原则

1. **`--dry-run`(或 `-n`)是你的安全气囊,先演练再真跑。** rsync 加上 `--dry-run` 只打印"我会做什么"但不真正执行。每次不确定时,先 dry-run 确认变更列表,看清楚了再去掉这个参数真正同步。这一条是铁律。

2. **源路径结尾的斜杠很关键,差一个字符结果完全不同。**
   - `rsync -a /src/dir/ /dst/` → 把 `dir/` **里面的文件**同步到 `dst/`
   - `rsync -a /src/dir /dst/` → 把 `dir` **这个目录**同步到 `dst/`(结果是 `dst/dir/...`)
   这个细节最容易翻车,每次写命令都要有意识地检查。

3. **`-a`(archive)是最常用的组合拳。** `-a` 等于 `-rlptgoD`——递归、保留符号链接、保留权限、保留时间戳、保留所有者等一套打包。几乎所有备份场景用 `-a` 就够了。

4. **`--delete` 让目标和源"完全一致",但会删文件——删除类操作必须先问主人。** 不加 `--delete`,源里删掉的文件在目标里还会存在。加了 `--delete`,目标会和源保持"镜像"一致——方便是方便,但风险是你可能误删重要文件。**使用 `--delete` 前必须先 dry-run,确认要删的文件列表是对的,再向主人确认,再真跑。**

5. **远程同步走 SSH,主机格式是 `user@host:/path/`。** `rsync -a /local/dir/ user@192.168.1.100:/backup/dir/` 通过 SSH 传输,和本地同步用法一样,只是目标路径前加了"用户@主机:"。前提是 SSH 可以连上去。

---

## 🛠 操作要点

### 安装

> ⚠️ **安装须知:以下安装命令须征得主人确认方可执行。**

```bash
# 验证是否已安装(Linux/macOS 通常自带)
rsync --version
# 期望: rsync  version 3.x.x ...

# macOS(Homebrew,升级到更新版)
brew install rsync

# Linux(Debian/Ubuntu)
sudo apt install rsync

# Windows — 推荐用 WSL(Windows Subsystem for Linux)后在 WSL 里用 rsync
```

> 🇨🇳 **中国用户提示:** rsync 在 Linux/macOS 上几乎自带,无需安装。本地→本地同步完全不需要网络,`-e ssh` 的远程同步只要能 SSH 登录服务器即可,无需科学上网。

### 最小可运行示例(纯本地,零风险)

**先建测试目录:**
```bash
# 创建测试源目录和文件
mkdir -p /tmp/rsync_src /tmp/rsync_dst
echo "文件A内容" > /tmp/rsync_src/fileA.txt
echo "文件B内容" > /tmp/rsync_src/fileB.txt
mkdir -p /tmp/rsync_src/subdir
echo "子目录文件" > /tmp/rsync_src/subdir/fileC.txt
```

**第一步:dry-run 先演练(强烈建议养成习惯)**
```bash
rsync -av --dry-run /tmp/rsync_src/ /tmp/rsync_dst/
# 输出示例:
# sending incremental file list
# fileA.txt
# fileB.txt
# subdir/
# subdir/fileC.txt
#
# Number of files: 4 (reg: 3, dir: 1)
# Number of created files: 4 (reg: 3, dir: 1)
# Number of files transferred: 3
# (这只是演练,文件还没有真正复制)
```

**第二步:确认没问题,真正同步**
```bash
rsync -av /tmp/rsync_src/ /tmp/rsync_dst/
# 真正执行,输出和 dry-run 类似但不带 "(DRY RUN)" 字样

# 验证
ls /tmp/rsync_dst/
```

**第三步:再次同步(看增量效果)**
```bash
# 修改一个文件
echo "文件A新内容" > /tmp/rsync_src/fileA.txt

# dry-run 看只会传哪个文件
rsync -av --dry-run /tmp/rsync_src/ /tmp/rsync_dst/
# 期望:只列出 fileA.txt,其他文件未变不传
```

### 常用选项速查

| 选项 | 含义 |
|------|------|
| `-a` | archive 模式:递归+保留权限+时间戳等 |
| `-v` | verbose:显示每个传输的文件名 |
| `-n` / `--dry-run` | 演练模式:不真正执行,只打印会做什么 |
| `--delete` | 删除目标中源里已删掉的文件(危险,先dry-run) |
| `--exclude='*.log'` | 排除匹配模式的文件 |
| `--include='*.py'` | 包含指定模式(配合 exclude 使用) |
| `-z` | 传输时压缩(远程同步时节省带宽) |
| `-P` | 显示进度 + 断点续传 |
| `--bwlimit=1000` | 限速 1000 KB/s(不占满带宽) |
| `-e ssh` | 指定 SSH 作为传输通道(远程同步默认也是) |
| `--checksum` | 用校验和判断变化(比默认的时间+大小更准,但慢) |
| `--stats` | 汇总统计信息 |
| `--progress` | 每个文件实时显示进度 |

### 远程同步(通过 SSH)

> ⚠️ 远程同步需要 SSH 权限,操作前须向主人确认目标服务器地址和权限。

```bash
# 本地 → 远程(推送备份)
rsync -avz /local/project/ user@192.168.1.100:/backup/project/

# 远程 → 本地(拉取)
rsync -avz user@192.168.1.100:/data/logs/ /local/logs/

# 先 dry-run 再推
rsync -avz --dry-run /local/project/ user@server:/backup/project/
```

### --delete 场景:镜像同步(高危,必须先问主人)

```bash
# dry-run 先看会删哪些文件
rsync -avz --dry-run --delete /tmp/rsync_src/ /tmp/rsync_dst/
# 输出里的 "deleting xxx" 就是会被删的文件

# 确认无误,主人点头,再真跑
rsync -avz --delete /tmp/rsync_src/ /tmp/rsync_dst/
```

### 常用备份脚本模板

```bash
#!/bin/bash
# backup.sh — 每日备份脚本模板

SRC="/home/user/projects/"
DST="/backup/projects/"
LOG="/var/log/rsync_backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] 开始备份..." >> "$LOG"

rsync -av --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='__pycache__/' \
  --exclude='*.pyc' \
  "$SRC" "$DST" >> "$LOG" 2>&1

echo "[$DATE] 备份完成" >> "$LOG"
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:完成一次本地目录的完整 rsync 同步流程:dry-run → 真同步 → 增量验证,附上真实命令和输出。**

测试数据可在本地生成,不需要联网:

**准备工作(安全,只在 /tmp 下操作)**
```bash
# 创建测试环境
mkdir -p /tmp/rstest_src/{docs,code}
echo "项目说明" > /tmp/rstest_src/README.md
echo "def hello(): pass" > /tmp/rstest_src/code/main.py
echo "需求文档" > /tmp/rstest_src/docs/spec.txt
mkdir /tmp/rstest_dst
```

**任务一:dry-run 演练,附输出**
```bash
rsync -av --dry-run /tmp/rstest_src/ /tmp/rstest_dst/
# 完整复制输出到报告卡,展示哪些文件"会被"同步
```

**任务二:真正同步,验证文件到位**
```bash
rsync -av /tmp/rstest_src/ /tmp/rstest_dst/
# 验证:
ls -R /tmp/rstest_dst/
# 期望:和 rstest_src 结构完全一致
```

**任务三:增量同步,验证只传变化**
```bash
# 只修改一个文件
echo "版本 2.0" >> /tmp/rstest_src/README.md

# 再次 dry-run,应只显示 README.md
rsync -av --dry-run /tmp/rstest_src/ /tmp/rstest_dst/
# 期望输出:只有 README.md 在列表中,其他文件不出现

# 真同步
rsync -av /tmp/rstest_src/ /tmp/rstest_dst/
# 验证:
diff /tmp/rstest_src/README.md /tmp/rstest_dst/README.md
# 期望:无差异(diff 无输出)
```

**验证标准:**
- 任务一输出显示 4 个文件"将被"传输,包含目录结构
- 任务二 `ls -R /tmp/rstest_dst/` 显示完整目录结构
- 任务三 dry-run 只列出 `README.md` 一个文件
- `diff` 命令确认两端文件内容一致

**沉淀技能卡:** 把常用选项速查 + 备份脚本模板 + 斜杠陷阱说明沉淀成 `skills/rsync.md`。

> ⚠️ **安全边界(严格遵守):**
> - **本地测试(上述 /tmp 操作)** 完全安全,可以直接做。
> - **`--delete` 参数** 会删除目标目录中的文件——**使用前必须 dry-run 确认，再向主人明确说明"哪些文件会被删除"，得到确认后才能真跑**。
> - **远程同步(含 user@host 路径)** 须向主人确认目标服务器地址、登录凭证和操作范围，未得确认不得执行。
> - **生产数据备份** 操作前必须确认源路径和目标路径都正确，斜杠多一个少一个结果完全不同——宁可多 dry-run 一次，不要硬着头皮跑。

---

## 🎓 过关标准

- [ ] 你完成了 dry-run 演练,输出了正确的文件列表
- [ ] 你完成了真正同步,验证了目标目录结构正确
- [ ] 你做了增量同步验证,证明只有变化的文件被传输
- [ ] 你能说清楚"源路径末尾有没有斜杠"的区别
- [ ] 你能说清楚"为什么 `--delete` 操作前必须 dry-run 并征得主人确认"
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,恭喜完成 T30 课!
