# 第 T02 课 · git 进阶——分支/rebase/cherry-pick/stash 救场

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:Git 官方文档 · [git-scm.com/docs](https://git-scm.com/docs) · [git-scm.com/book/zh/v2](https://git-scm.com/book/zh/v2)

---

## 📖 你要学会什么

学完这一课,当你遇到下面这些让人抓狂的场面,你能冷静地用对应的 git 命令解决:

- "我在错误的分支上改了一半代码,怎么转移?"—— `stash`
- "我要把另一个分支的某一次改动单独摘过来,不要整个分支"—— `cherry-pick`
- "我的分支提交记录乱成一团,想整理干净再合并"—— `rebase`
- "我刚才 reset 把提交弄丢了,怎么找回来?"—— `reflog`

把 git 历史想象成一条**时间线轨道**。普通 `commit` 是在轨道上向前走一步;`branch` 是分叉开一条新轨道; `merge` 是把两条轨道合并成一条;而 `rebase`、`cherry-pick`、`stash` 则是**穿越、搬运、暂停**的超能力:

- **stash** = 把手头没写完的东西暂时"压入抽屉",切去干别的,回来再取出来接着写
- **cherry-pick** = 从另一条轨道上摘一个时间节点过来,贴到你现在的轨道上
- **rebase** = 把你这条轨道的起点"挪到"另一条更新的轨道末端,让历史看起来是连续的
- **reflog** = git 的"黑匣子",所有操作都记着,丢了东西去这里找

**官方资料:**
- Git 官方文档: [git-scm.com/docs](https://git-scm.com/docs)
- Pro Git 中文版: [git-scm.com/book/zh/v2](https://git-scm.com/book/zh/v2)
- cherry-pick 文档: [git-scm.com/docs/git-cherry-pick](https://git-scm.com/docs/git-cherry-pick)

---

## 🧠 核心原则

1. **分支极其廉价,多开不心疼。** 一个分支只是一个指针,不复制代码。开新分支的成本几乎是零——遇到任何"不确定"的操作,先开个分支再试,错了删掉就好。

2. **rebase 会改写历史,merge 不会。** `git merge` 加一个合并提交,历史可以追溯;`git rebase` 把你的提交"嫁接"到别人最新的代码上,历史更线性但原提交 hash 变了。**已经推送到远程的提交,rebase 后要 force push——这件事要先跟团队说清楚**,否则别人的仓库会乱。

3. **cherry-pick 是"点菜",merge 是"上全席"。** 只想要对方分支的某一次修复?cherry-pick 那一个 commit hash 过来。要整个分支所有改动?才用 merge。

4. **stash 是临时停车位,不是长期车库。** `git stash` 只是应急用,不要把代码 stash 了就忘了。`git stash list` 能看到所有暂存;时间久了容易忘记内容,及时用 `git stash pop` 取出或 `git stash drop` 删掉。

5. **reflog 是最后的救命绳。** `git reset --hard` 把提交"删"了?`git reflog` 能找到那个 commit hash,再 `git checkout <hash>` 把它救回来。

---

## 🛠 操作要点

### 分支基础

```bash
# 创建并切换新分支
git switch -c feature/login-fix

# 查看所有分支
git branch -a

# 切换到已有分支
git switch main

# 删除已合并的分支
git branch -d feature/login-fix

# 强制删除(未合并也删)
git branch -D feature/abandoned
```

### stash:把手头工作"压抽屉"

```bash
# 暂存当前所有未提交的改动
git stash

# 暂存时加个备注(强烈推荐,防止忘记)
git stash push -m "登录页改到一半,待续"

# 查看所有暂存
git stash list

# 取出最新的一条(并删掉 stash 记录)
git stash pop

# 取出特定一条(stash@{2}),保留 stash 记录
git stash apply stash@{2}

# 删掉某条 stash
git stash drop stash@{0}
```

### cherry-pick:从别的分支摘一个提交

```bash
# 先找到那个提交的 hash
git log feature/hotfix --oneline

# 把那个 commit 摘到当前分支
git cherry-pick abc1234

# 摘多个 commit
git cherry-pick abc1234 def5678

# 摘一段范围内的 commit(左开右闭)
git cherry-pick abc1234..def5678

# 遇到冲突:解决冲突后继续
git cherry-pick --continue

# 或放弃
git cherry-pick --abort
```

### rebase:把分支的起点挪到最新位置

```bash
# 把当前分支 rebase 到 main 最新位置
git rebase main

# 遇到冲突:解决后继续
git rebase --continue

# 或放弃
git rebase --abort

# 交互式 rebase:整理最近 3 个提交(合并/改写/删除)
git rebase -i HEAD~3
```

交互式 rebase 打开的编辑器里,每行一个 commit,可以改前面的命令:

| 命令 | 作用 |
|------|------|
| `pick` | 保留这个 commit |
| `squash` / `s` | 和上一个 commit 合并 |
| `reword` / `r` | 保留 commit 但修改提交信息 |
| `drop` / `d` | 删掉这个 commit |
| `edit` / `e` | 暂停让你修改这个 commit |

### reflog:找回"丢失"的提交

```bash
# 查看最近所有操作(包括 reset、rebase 等)
git reflog

# 找到想要恢复的 commit hash,切过去
git checkout abc1234

# 或者开一个新分支保存它
git switch -c rescue/recovered abc1234

# 把找回的提交合并回来
git cherry-pick abc1234
```

### 救场场景速查

| 你遇到了什么 | 用什么救 |
|-------------|----------|
| 改错分支了,代码没提交 | `git stash` + `git switch 正确分支` + `git stash pop` |
| 只想要对方的某个 bug 修复 | `git cherry-pick <commit hash>` |
| 分支历史太乱,想并入主干前整理 | `git rebase -i HEAD~N` |
| reset 后反悔了 | `git reflog` 找 hash + `git checkout <hash>` |
| 主干更新了,想让你的分支也是最新基础 | `git rebase main` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:在本地制造一个混乱局面,然后用进阶 git 命令一步步救场,全程记录命令和输出。**

搭建演练环境:

```bash
# 在一个临时目录初始化一个 git 仓库
mkdir /tmp/git-rescue-lab && cd /tmp/git-rescue-lab
git init
git config user.name "Agent学员"
git config user.email "agent@school.test"

# 制造几个提交
echo "第一版" > story.txt && git add . && git commit -m "初稿"
echo "第二版" > story.txt && git add . && git commit -m "修改"
echo "第三版" > story.txt && git add . && git commit -m "精修"
```

完成以下 3 个救场任务,每个任务记录命令 + 真实输出:

**任务一:stash 救场**
```bash
# 模拟"改到一半突然要切分支"
echo "改到一半没写完" >> story.txt
# 用 stash 保存
git stash push -m "story 改到一半"
git stash list  # 验证 stash 进去了
git stash pop   # 取回来
```

**任务二:cherry-pick**
```bash
# 开一个临时分支,做一个紧急修复
git switch -c hotfix
echo "紧急修复内容" > fix.txt && git add . && git commit -m "hotfix: 紧急修复"
git log --oneline  # 记下这个 commit hash

# 回到 main,把这个修复摘过来
git switch main
git cherry-pick <刚才的hash>  # 替换为真实 hash
git log --oneline  # 验证它出现在 main 了
```

**任务三:interactive rebase 整理历史**
```bash
# 查看当前历史
git log --oneline
# 把最近 3 个 commit 合并成 1 个
git rebase -i HEAD~3
# (在编辑器中把后两个 pick 改成 squash,保存退出)
git log --oneline  # 验证 3 个变成了 1 个
```

把以上三个任务的命令 + 输出整理成报告卡,沉淀技能卡到 `skills/git-advanced.md`。

> ⚠️ **安全边界(守住这条线):** `git rebase` 和 `git reset --hard` 会**改写历史**;在真实团队仓库上操作前**必须先向主人确认**。演练请在 `/tmp` 的本地仓库进行,不要在主人的工作仓库里直接练手。`git push --force` 更是高危操作——**没有主人明确授权,绝对不执行**。

---

## 🎓 过关标准

- [ ] 你完成了 stash 救场任务,附上 `git stash list` 的真实输出
- [ ] 你完成了 cherry-pick,附上 cherry-pick 前后的 `git log --oneline` 对比
- [ ] 你完成了 interactive rebase,3 个提交变成 1 个(附 `git log --oneline` 对比)
- [ ] 你能说清楚 `rebase` 和 `merge` 的关键区别(改写历史 vs 保留历史)
- [ ] 你能说清楚什么情况下用 `reflog` 救命
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
