# 第 T01 课 · gh(GitHub CLI)命令行管 PR 与 Issue

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:GitHub CLI 官方手册 · [cli.github.com/manual/](https://cli.github.com/manual/) · [docs.github.com/en/github-cli](https://docs.github.com/en/github-cli)

---

## 📖 你要学会什么

学完这一课,你能用 `gh` 这把"命令行遥控器"操控 GitHub——查 PR、提 PR、看 issue、打标签——而不用离开终端、不用点浏览器。

想象你是一个搬运工,仓库就是一座大楼。以前你要办什么事(看电梯里有什么、送包裹到几楼),得跑到大楼前台排队、手动点屏幕。`gh` 干的事就是:**给你一台对讲机,站在原地说一句话,大楼就给你回应**。速度更快、留记录、还能脚本化自动干。

`gh` 是 GitHub 官方出品的命令行工具,支持 macOS / Linux / Windows,能直接驱动 GitHub API 完成几乎全部仓库操作。

**官方资料:**
- 官方手册: [cli.github.com/manual/](https://cli.github.com/manual/)
- GitHub Docs: [docs.github.com/en/github-cli](https://docs.github.com/en/github-cli)
- GitHub 仓库: [github.com/cli/cli](https://github.com/cli/cli)

---

## 🧠 核心原则

1. **先认证,再干活。** `gh` 所有操作都需要登录 GitHub 账号。`gh auth login` 是第一步,没认证什么都干不了。就像对讲机得先配频道,配好了才能通话。

2. **仓库上下文是自动感知的。** 在一个 git 仓库目录里运行 `gh` 命令,它会自动识别当前仓库是哪个——无需手动指定 `--repo`。如果要操作别的仓库,加 `--repo owner/name` 明确说。

3. **命令结构像是在说人话。** `gh pr list`(列出 PR)、`gh issue create`(新建 issue)、`gh pr merge`(合并 PR)——动词 + 名词,比记 API 路径简单多了。

4. **能输出 JSON,就能接管道。** 所有列表命令都支持 `--json` + `--jq` 过滤,可以直接和 `jq`(见 T04 课)联动,输出你要的字段。

5. **省上下文优先。** agent 操作 GitHub 时,`gh` 比"打开浏览器截图"省 100 倍的 token。能用命令完成就用命令。

---

## 🛠 操作要点

### 安装

```bash
# macOS(Homebrew)
brew install gh

# Linux(Debian/Ubuntu)
sudo apt install gh
# 或用官方脚本:
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Windows(WinGet)
winget install --id GitHub.cli
```

> 🇨🇳 **中国用户提示:** GitHub 本身在国内访问不稳定,`gh` 作为 GitHub 的 CLI 工具同样受影响。若下载安装包或 `gh auth login` 时超时,需要科学上网。安装包也可在 [github.com/cli/cli/releases](https://github.com/cli/cli/releases) 下载对应系统的二进制,手动安装。

### 认证登录

```bash
# 交互式登录(会弹出浏览器或给你一个设备码)
gh auth login

# 验证是否已登录
gh auth status
```

### PR 操作速查

```bash
# 列出当前仓库所有 open 的 PR
gh pr list

# 查看某个 PR 的详情(如 PR #42)
gh pr view 42

# 在当前分支创建一个新 PR
gh pr create --title "修复登录 bug" --body "详细说明..."

# 检出(切换到)某个 PR 的代码
gh pr checkout 42

# 合并 PR
gh pr merge 42 --merge

# 查 PR 的 CI 状态
gh pr checks 42
```

### Issue 操作速查

```bash
# 列出所有 open 的 issue
gh issue list

# 查看某个 issue
gh issue view 7

# 创建新 issue
gh issue create --title "首页崩溃" --body "复现步骤..."

# 给 issue 加标签
gh issue edit 7 --add-label "bug"

# 关闭 issue
gh issue close 7
```

### 输出 JSON + 过滤

```bash
# 列出 PR,只要 PR 号、标题、作者
gh pr list --json number,title,author --jq '.[] | "\(.number) \(.title) by \(.author.login)"'
```

### 常用标志

| 标志 | 含义 |
|------|------|
| `--repo owner/name` | 指定操作哪个仓库 |
| `--state closed` | 查已关闭的 PR/issue |
| `--limit 20` | 最多返回 20 条 |
| `--assignee @me` | 只看分配给自己的 |
| `--label bug` | 按标签筛选 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 `gh` 命令行完成一次完整的 issue 生命周期管理,并提交一份 PR 查看报告。**

具体步骤:

1. **写出完整的命令序列**,在一个你能访问的 GitHub 仓库里(可以是自己的测试仓库):
   - `gh auth status` —— 确认已登录,截取或复制输出
   - `gh issue create --title "测试 issue" --body "这是 gh CLI 毕业测验"` —— 创建一个 issue
   - `gh issue list` —— 列出 issue,确认刚才那条出现了
   - `gh issue close <issue号>` —— 关闭它
   - `gh pr list --json number,title,state --jq '.[] | "\(.number) \(.title) [\(.state)]"'` —— 列出仓库的 PR 并格式化输出

2. **记录每条命令的真实输出**(命令 + 标准输出,原样粘贴)。

3. **写出"怎么验证成功"的标准**:
   - `gh auth status` 显示已认证的账户和仓库权限
   - `gh issue list` 能看到刚创建的 issue
   - `gh issue close` 后再 `gh issue list --state closed` 能看到该 issue

4. **写出安全提示**:
   - 操作真实仓库的 PR(合并/关闭)前,**必须先向主人确认**,误操作 merge 了不该合并的 PR 会造成代码事故。
   - `gh auth login` 会请求 GitHub OAuth 授权,**只在主人确认的账号和仓库上操作**。

5. **把命令序列 + 真实输出整理成报告卡**,写进你宿舍文件(如 `agent-school/skills/gh-cli-report.md`)。

6. **沉淀技能卡**:把最常用的 `gh pr`/`gh issue` 命令、JSON 输出过滤技巧沉淀成 `skills/gh-cli.md`。

> ⚠️ **安全边界(守住这条线):** 认证(`gh auth login`)和对真实仓库的写操作(create PR、merge PR、close issue)**必须先得到主人确认再执行**。只读操作(`gh pr list`、`gh issue view`)相对安全,但操作的仓库范围也要让主人知道。

---

## 🎓 过关标准

- [ ] 你跑过 `gh auth status`,输出显示已认证(附真实输出)
- [ ] 你跑过 `gh issue create` 并成功创建了一条 issue(附 issue 链接或 ID)
- [ ] 你跑过 `gh pr list --json ...` 并输出了格式化的 PR 列表(附真实输出)
- [ ] 你写出了"误合并 PR"的防护提示,理解写操作需先确认
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
