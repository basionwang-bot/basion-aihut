# 第 B05 课 · Plane:开源项目管理,自建团队看板跑 Sprint

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T31(Docker) ｜ 难度:★★★ ｜ 源头:makeplane/plane · [github.com/makeplane/plane](https://github.com/makeplane/plane)

---

## 📖 你要学会什么

Jira 太重了——光是搞懂配置就要半天;Trello 太轻了——稍微复杂一点的项目就管不住。Linear 好用,但月费不便宜,数据在人家服务器上。

Plane 是**开源的项目管理工具**,GitHub 约 50.7k ★(AGPL 3.0 开源),定位是"现代版 Jira/Linear 的开源替代"——Issues(任务)、Cycles(Sprint)、Modules(模块)、Views(视图)、Pages(文档)、Analytics(分析)都有,可以自己部署,数据自己管。

学完这门课,你能:
1. 用 Plane Cloud(免费托管版)或 Docker 自托管把 Plane 跑起来
2. 创建一个项目,建好任务列表
3. 开启一个 Cycle(Sprint),跑一遍完整的迭代流程
4. 知道"自托管 Plane"连接真实团队时的边界在哪

> 🇨🇳 **中国用户友好度:★★★**
> Plane Cloud(cloud.plane.so)可免费注册使用,**无需翻墙但需要海外邮箱或 Google 账号**——如果主人有 Gmail 即可。自托管版通过 Docker Compose 部署,部署过程需要访问 Docker Hub 拉取镜像,建议在能访问国际网络的机器上操作,或使用国内 Docker 镜像源。界面目前是英文,功能逻辑清晰。

**官方资料:**
- Plane 仓库: [github.com/makeplane/plane](https://github.com/makeplane/plane)
- Plane Cloud(免费托管): [app.plane.so](https://app.plane.so)
- 自托管文档: [developers.plane.so/self-hosting/overview](https://developers.plane.so/self-hosting/overview)

---

## 🧠 核心原则

1. **Issues = 任务卡片,是一切的基础。** 就像便利贴——每张贴纸就是一个任务(Issue),上面可以写标题、描述、优先级、负责人、截止日期、标签。所有的组织方式(看板、Sprint、模块)本质上都是在"管理这些贴纸怎么排列"。

2. **Cycle = Sprint(迭代周期)。** 软件团队常说"这期迭代做什么"——在 Plane 里这个"迭代周期"叫 Cycle。你把若干 Issues 拖进一个 Cycle,设好开始/结束日期,Plane 会自动画"燃尽图"(burn-down chart)——直观告诉你"还剩多少工作没做完、按这个进度能不能按时交付"。

3. **Module = 项目里的子模块。** 比如你在做一个 App,可以分三个 Module:用户系统、支付模块、推送通知。每个 Module 管一批相关的 Issues,方便按功能块汇报进度。

4. **Views = 筛选器 + 自定义视角。** 同一批 Issues,可以建不同的 View——"我负责的任务"、"本周到期的任务"、"高优先级未完成"……每个视角都是一组过滤条件的组合,不用重复找。

5. **Pages = 团队共用的笔记本。** Plane 内置了文档功能,可以写会议记录、产品需求、讨论纪要,和 Issues 联动引用。AI 辅助写作功能也在这里。

---

## 🛠 操作要点

### 方式一:Plane Cloud(最快上手,无需部署)

访问 [app.plane.so](https://app.plane.so),注册免费账号。

> 🇨🇳 **国内用户提示:** Plane Cloud 注册需要邮箱,支持 Google 账号登录。如主人有 Gmail 即可直接使用。无需信用卡,免费版够个人和小团队用。

### 方式二:Docker Compose 自托管

官方推荐用 Docker Compose 自托管,详细步骤在 [developers.plane.so/self-hosting/methods/docker-compose](https://developers.plane.so/self-hosting/methods/docker-compose)。

核心步骤(以下命令请先征得主人确认):

```bash
# 下载官方部署脚本
curl -fsSL https://raw.githubusercontent.com/makeplane/plane/master/deploy/selfhost/install.sh | sed 's/update_host/# update_host/g' | bash

# 进入生成的目录
cd plane-selfhost

# 编辑 .env 文件(配置域名、密钥等)
# 必须修改:SECRET_KEY(换成随机字符串)
# 可选修改:WEB_URL(填你的域名或 IP)

# 启动
docker compose up -d
```

> ⚠️ **自托管前必须告知主人:**
> - 拉取镜像和启动需要时间,会占用磁盘和内存
> - 生产使用前必须修改 `SECRET_KEY` 为随机值
> - 如果要对外访问需要配置防火墙和 HTTPS
> - 自托管需要主人负责维护和备份

### 第一步:创建第一个 Workspace 和 Project

1. 登录后,先创建一个 **Workspace**(工作空间),相当于你的组织/公司名。
2. 点 **+ Create Project**,填写:
   - 项目名称(如"2024 年 Q3 产品迭代")
   - 标识符(3 个字母,Issue 编号前缀)
   - 访问权限(Secret = 仅成员可见)

### 第二步:建 Issue 任务

1. 进入项目,点 **Issues → + Create Issue**
2. 填写标题、描述(支持富文本和文件上传)
3. 设置:
   - **State**:Backlog / Todo / In Progress / Done / Cancelled
   - **Priority**:Urgent / High / Medium / Low / None
   - **Assignees**:指定负责人
   - **Due Date**:截止日期

建议一次性建 10-15 个 Issues,覆盖不同状态和优先级,后续 Cycle 练习会用到。

### 第三步:开启一个 Cycle(Sprint)

1. 左侧菜单点 **Cycles → + New Cycle**
2. 填写 Cycle 名称(如"Sprint 1")、开始日期、结束日期(建议 1-2 周)
3. 进入 Cycle 详情,把相关 Issues 拖进来(或点 **+ Add Issues**)
4. 点 **Analytics** 查看燃尽图——它会实时显示"还剩多少工作量"

### 第四步:更新 Issue 状态,推进 Sprint

把 Issues 从 "Todo" 拖到 "In Progress",完成后拖到 "Done"。观察燃尽图的变化。

### 第五步:Sprint 结束后的收尾

Cycle 结束后:
- 未完成的 Issues 可以"转移"到下一个 Cycle
- 在 Cycle 的 Analytics 页面截图,作为 Sprint 回顾的数据依据

### ⚠️ 安全红线

**无代码/AI工具一旦"连真实数据库、配生产key、对外部署"就从玩具变真系统。三件事——连真实数据、暴露上线、产生账单——都要明确"先问主人再做":**

```
□ 自托管部署 Docker Compose——先征得主人确认,说明资源占用和维护责任
□ 邀请真实团队成员加入 Workspace——先问主人,确认数据已准备好对成员可见
□ 把自托管 Plane 对外暴露(公网 IP/域名)——先问主人,需配 HTTPS 和安全设置
□ 生产环境 SECRET_KEY 必须改为随机值——告知主人,不能用默认值
□ 如果主人在 Plane Pages 里记录敏感信息(商业计划/薪资等)——确认访问权限配置正确
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:在 Plane 里搭建一个完整的项目，跑完一个 Cycle(Sprint)，交截图证据。**

**阶段一:上手**

1. 用 Plane Cloud(app.plane.so)注册账号(推荐,最快)或自托管启动。截图显示已登录进入主界面。
2. 创建一个 Project,截图显示项目已创建。

**阶段二:创建任务列表**

3. 在项目里创建至少 10 个 Issues,覆盖不同优先级(High/Medium/Low)和不同状态(Backlog/Todo/In Progress)。截图显示 Issues 列表。

**阶段三:跑一个 Cycle**

4. 创建一个 Cycle(起止日期设为本周或近期 2 周),把 5-8 个 Issues 加进去。截图显示 Cycle 详情和已加入的 Issues。
5. 把 2-3 个 Issues 状态改为 "In Progress",再把 1-2 个改为 "Done"。截图更新后的 Cycle 燃尽图(Analytics)。

**阶段四:说清楚**

6. 用自己的话描述:Cycle 和 Module 有什么区别?分别适合什么场景?

**阶段五:沉淀**

7. **沉淀技能卡**:把"Plane 快速上手步骤 + Cycle 使用流程 + 核心概念对照表(Issue/Cycle/Module/View) + 安全红线"沉淀成 `skills/plane.md`。

---

## 🎓 过关标准

- [ ] 你成功创建了 Plane 账号和 Project,有截图证据
- [ ] 你创建了至少 10 个 Issues,涵盖不同状态和优先级
- [ ] 你创建了一个 Cycle 并运行完一次迭代流程(含燃尽图截图)
- [ ] 你能用自己的话解释 Issue / Cycle / Module / View 四个概念的区别
- [ ] 你完成了安全红线清单 5 条的逐项确认
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
