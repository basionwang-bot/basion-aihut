# 第 A05 课 · Dify:把"提问→检索→AI回答→触发动作"串成国产友好的 AI 流水线

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 + A01~A04 ｜ 难度:★★★★ ｜ 源头:[github.com/langgenius/dify](https://github.com/langgenius/dify)（约 145k ⭐,Dify Open Source License,基于 Apache 2.0）

---

⚠️ **全院统一安全红线(每门课开头重申)**

这类工具会**连接真实账号、真的发邮件改数据**。铁律三连:
1. **先用测试账号/沙箱**,不要上来就接生产账号;
2. **关键动作(发送/删除)先加人工确认节点**,让主人看一眼再放行;
3. **接生产账号前先问主人**,征得明确同意。

给 AI 接能力要设最小权限。

---

## 📖 你要学会什么

前面几门课(A01-A04)讲的是"数据流水线"——数据从这里流到那里,中间加工一下。Dify 做的是**"AI 流水线"**——数据流动的每一步,都可以有大模型参与推理、理解、生成。

想象一个公司的知识问答助手:用户提了个问题 → AI 去知识库里检索相关文档 → AI 基于文档生成答案 → 如果问的是投诉,自动触发工单系统。这条链路在 Dify 里可以**拖拽可视化地搭出来**,不用写一行后端代码。

**Dify 的国内友好优势:**
- 全中文界面,官方中文文档
- 可接国产大模型:通义千问、文心一言、智谱 GLM、Moonshot(Kimi)、DeepSeek 等
- 可完全本地/私有化部署,数据不出境
- 不需要科学上网即可使用

学完这一课,你能:
- 用 Docker Compose 在本地部署 Dify
- 理解 Workflow(工作流)、RAG Pipeline(检索增强生成)、Agent 这三个核心概念
- 搭出一条完整的"提问→检索资料→AI 回答→触发动作"AI 流水线

**官方资料:**
- 仓库: [github.com/langgenius/dify](https://github.com/langgenius/dify)
- 官网: [dify.ai](https://dify.ai)
- 中文文档: [docs.dify.ai/zh-hans](https://docs.dify.ai/zh-hans)

---

## 🧠 核心原则

1. **Dify 是"AI 编排平台",不是普通的自动化工具。** A01-A04 的工具处理的是确定性数据流:收到 X 就做 Y。Dify 加入了"AI 理解"这一层:收到用户的问题 → AI 理解语意 → 决定去哪里找信息 → AI 生成回答 → 决定触发什么动作。这是**非确定性的智能流水线**。

2. **RAG = "给 AI 配备资料袋"。** RAG(检索增强生成)是 Dify 的核心技术之一。打个比方:让 AI 回答问题,原本是靠它"脑子里记住的知识"。RAG 是说:先把你的文档(PDF、Word、网页……)导入 Dify 知识库,用户问问题时先去知识库检索相关段落,再把这些段落"塞进"大模型的提示词里,大模型基于你的真实资料回答——而不是凭空发挥。

3. **Workflow 是可视化的 AI 流水线编辑器。** 类似 A01 的 Node-RED,但每个节点都可以是"调用大模型""检索知识库""执行代码""调用 HTTP API"等。把这些节点连起来,就是一条 AI 工作流。

4. **许可证:Dify Open Source License(基于 Apache 2.0 + 附加条款)。** 个人使用、内部部署完全没问题。附加条款主要针对大规模商业使用和二次分发,不影响普通用户。使用前可在 [github.com/langgenius/dify/blob/main/LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE) 查看原文。

5. **先征得主人确认,再安装、再接大模型 API Key、再接外部动作。** 大模型 API Key 会产生费用,接入前必须告知主人。接外部服务(邮件、工单、数据库)前必须确认。

---

## 🛠 操作要点

### 用 Docker Compose 部署 Dify

**系统要求:** CPU ≥ 2 核,内存 ≥ 4 GB

```bash
# 拉取仓库
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 复制配置文件
cp .env.example .env

# 启动所有服务
docker compose up -d
```

> ⚠️ **启动前先征得主人确认。** 这会创建多个容器(Web、API、Worker、数据库、Redis、向量数据库等),比前几课的 Docker 服务更重。

服务就绪后,浏览器打开:

```
http://localhost/install
```

首次访问会进入初始化界面,按提示创建管理员账号。

> 🇨🇳 **国内部署提示:**
> - Docker 镜像如果拉取慢,配置国内镜像加速
> - Dify 本体部署不需要科学上网
> - **大模型 API Key 的网络访问要求因模型而异**:接 OpenAI/Claude 等海外模型需要代理;接通义千问、文心、DeepSeek、Kimi 等国产模型直接访问即可

### 接入国产大模型(国内用户优先)

登录 Dify 后台 → **Settings(设置)** → **Model Provider(模型供应商)**

国内可直接配置的供应商举例(不需要科学上网):

| 供应商 | 代表模型 | 申请地址 |
|--------|---------|---------|
| 通义千问(阿里云) | qwen-turbo, qwen-plus | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| 文心一言(百度) | ERNIE-4.0 | [cloud.baidu.com](https://cloud.baidu.com) |
| DeepSeek | deepseek-chat | [platform.deepseek.com](https://platform.deepseek.com) |
| Moonshot(Kimi) | moonshot-v1-8k | [platform.moonshot.cn](https://platform.moonshot.cn) |
| 智谱 GLM | glm-4 | [open.bigmodel.cn](https://open.bigmodel.cn) |

**配置步骤:**

1. 在对应平台申请 API Key(需要主人账号)
2. Dify Settings → Model Provider → 选择对应供应商 → 填入 API Key
3. 填好后点 Save,Dify 会测试连通性

> ⚠️ **API Key 由主人提供并亲自填入**,你不能替主人申请账号或填写 Key。国产模型 API 通常需要实名认证和充值,告知主人。

### 创建知识库(RAG 基础)

知识库就是"给 AI 看的资料袋"。操作:

1. 左侧导航 → **Knowledge(知识库)** → **Create Knowledge**
2. 上传文档(支持 PDF、Word、TXT、Markdown、网页等)
3. 等待 Dify 处理文档:切块 → 生成向量嵌入
4. 处理完成后,知识库就可以在 Workflow 或对话中引用

> 📌 **嵌入模型(Embedding)的选择:** 知识库的检索质量依赖嵌入模型。Dify 支持多种嵌入模型,国内推荐通义千问的 text-embedding 系列或 BGE 系列(可本地部署)。

### 搭出核心 AI 流水线:提问→检索→AI回答→触发动作

这是本课的真任务。在 Dify 里,用 **Workflow** 编辑器来搭:

**第一步:新建 Workflow 应用**

1. 首页 → **Create App** → 选 **Workflow**
2. 给应用取名,如"知识问答+自动通知"

**第二步:添加节点——START(起点)**

起点节点接收用户输入:
- 添加一个输入变量 `user_question`(字符串),代表用户的问题

**第三步:添加 Knowledge Retrieval 节点(检索)**

1. 在画布上点"+"添加节点 → 选 **Knowledge Retrieval**
2. 选择你已创建的知识库
3. 设置检索参数:返回 Top 3 相关段落
4. 配置输入变量:用 `{{user_question}}` 作为查询词
5. 输出变量命名为 `retrieved_docs`

**第四步:添加 LLM 节点(AI 生成回答)**

1. 添加 **LLM** 节点
2. 选择你配置好的大模型
3. 设置 System Prompt:
   ```
   你是一位专业的知识助理。请根据以下检索到的资料，用简洁、准确的中文回答用户问题。
   如果资料中没有相关信息，请如实告知用户。
   ```
4. 设置 User Message:
   ```
   用户问题: {{user_question}}
   
   参考资料:
   {{retrieved_docs}}
   ```
5. 输出变量命名为 `ai_answer`

**第五步:添加 IF/ELSE 条件节点(判断是否触发动作)**

比如:如果用户问的是投诉相关问题,触发额外通知:

1. 添加 **IF/ELSE** 节点
2. 条件:检查 `ai_answer` 是否包含关键词(或让 LLM 判断意图)
3. True 分支 → 触发通知节点
4. False 分支 → 直接输出回答

**第六步:添加 HTTP Request 节点(触发外部动作)**

如果判断需要触发动作:
1. 添加 **HTTP Request** 节点
2. 填入 Webhook 地址(如飞书机器人 Webhook、钉钉 Webhook)
3. 设置请求体,包含 `ai_answer` 变量

> ⚠️ **Webhook 地址必须由主人提供**,且应先用测试 Webhook(如 [webhook.site](https://webhook.site))验证流程,不要直接接生产机器人。

**第七步:添加 END 节点(输出)**

配置最终输出:`ai_answer`

**第八步:保存并测试**

1. 点右上角 **Save** 保存工作流
2. 点 **Preview** 或 **Run** 进入测试模式
3. 输入一个测试问题,观察每个节点的执行情况
4. 绿色=成功,红色=报错,点击节点可查看输入/输出数据

### 安全确认清单

```
□ docker compose up -d 已征得主人确认
□ 大模型 API Key 由主人申请并亲自填入
□ 知识库上传的文档是主人授权可以处理的内容
□ 外部动作(Webhook/邮件)用测试地址先验证
□ 应用发布前告知主人,说明会接哪些外部服务
□ 了解 Dify 许可证条款,商业使用前查原文
□ 生产账号接入前再次征得主人明确确认
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:搭出一条"用户提问→检索知识库→AI 回答→条件触发通知"的完整 AI 流水线。**

**第一阶段:理解(可先做)**

1. **解释 RAG 的工作原理**:用"资料袋"这个比喻,详细说明 RAG 的三步——上传文档→检索→注入提示词。为什么 RAG 比"只靠大模型记忆回答"更可靠?

2. **比较 Dify 和 n8n**:两者都有可视化工作流编辑器。它们的核心区别是什么?什么场景用 Dify 更合适,什么场景用 n8n 更合适?

3. **国产模型接入的意义**:为什么"可接国产大模型"对中国用户很重要?举出 2-3 个不需要科学上网就能用的国产大模型 API,说明它们各自的特点。

**第二阶段:真做(需要主人确认安装)**

> ⚠️ **先征得主人确认安装 Docker 且提供大模型 API Key 后再做此阶段。**

4. **启动 Dify**:运行 `docker compose up -d`,等待就绪,截图 `http://localhost/install` 或主界面。

5. **配置至少一个大模型供应商**:由主人填入 API Key,截图 Settings → Model Provider 显示模型已连接。

6. **创建一个知识库**:上传至少一份文档(可以是任意文本文件),等待处理完成,截图知识库内容列表。

7. **搭出 5 节点 AI 流水线**:START → Knowledge Retrieval → LLM → IF/ELSE → END(+HTTP Request)。截图完整工作流连线图。

8. **测试运行**:在 Preview 模式输入一个测试问题,截图每个节点的执行结果,特别是 LLM 节点的输入(检索到的资料)和输出(AI 回答)。

9. **沉淀技能卡**:把"Dify 启动命令 + 国产模型配置方法 + RAG 流水线节点结构 + 安全清单"沉淀成 `skills/dify-rag-workflow.md`。

> ⚠️ **安全边界再强调:**
> - `docker compose up -d` ——**运行前先征得主人确认**
> - 大模型 API Key ——**主人亲自填写,会产生费用**
> - 知识库文档 ——**只上传主人授权可处理的内容**
> - 外部 Webhook/动作 ——**先用测试地址**

---

## 🎓 过关标准

- [ ] 你能用"资料袋"比喻清楚解释 RAG 的三步流程
- [ ] 你能说出 Dify 和 n8n 的核心区别,以及各自适合的场景
- [ ] 你能列出至少 3 个国产大模型 API 及其适用特点
- [ ] 你成功在本地启动 Dify,配置了大模型并创建了知识库(有截图)
- [ ] 你搭出了完整的 5 节点 AI 流水线并测试通过(有截图)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
