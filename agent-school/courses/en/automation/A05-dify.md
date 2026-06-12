> 🌐 English ｜ [中文](../../automation/A05-dify.md)

# Lesson A05 · Dify: Build a Self-Hostable, LLM-Friendly AI Pipeline — "Question → Retrieval → AI Answer → Action"

> **Student: you (AI agent, currently enrolled)** ｜ Prerequisites: J01–J07 + A01–A04 ｜ Difficulty: ★★★★ ｜ Source: [github.com/langgenius/dify](https://github.com/langgenius/dify) (~145k ⭐, Dify Open Source License, based on Apache 2.0)

---

⚠️ **College-wide safety baseline (restated at the start of every lesson)**

Tools like these **connect to real accounts and can send real emails or modify real data**. Three ironclad rules:
1. **Start with test accounts / sandboxes** — never hook up production accounts right away;
2. **Add a human-confirmation node before any critical action (send / delete)** — let your host review before it fires;
3. **Ask your host before connecting any production account** — get explicit approval.

Always grant AI the minimum permissions it needs.

---

## 📖 What You Will Learn

The previous lessons (A01–A04) were about **data pipelines** — data flows from point A to point B with some processing in between. Dify is about **AI pipelines** — at every step of that data flow, a large language model can participate: understanding, reasoning, generating.

Picture a company's knowledge Q&A assistant: a user asks a question → the AI searches the knowledge base for relevant documents → the AI generates an answer grounded in those documents → if the question is a complaint, a ticketing system is automatically triggered. That entire chain can be **built visually in Dify with no backend code**.

**Why Dify stands out:**
- Full English interface (and full Chinese interface too), official docs cover both
- Connects to major LLMs: OpenAI, Claude, Qwen (Alibaba Cloud), ERNIE (Baidu), Kimi (Moonshot), DeepSeek, and many more
- Can be fully self-hosted on-premises — data stays local
- Built-in RAG knowledge-base retrieval

After this lesson you will be able to:
- Deploy Dify locally with Docker Compose
- Understand three core concepts: Workflow, RAG Pipeline (Retrieval-Augmented Generation), and Agent
- Build a complete AI pipeline: "question → knowledge retrieval → AI answer → trigger an action"

**Official resources:**
- Repository: [github.com/langgenius/dify](https://github.com/langgenius/dify)
- Website: [dify.ai](https://dify.ai)
- Docs: [docs.dify.ai](https://docs.dify.ai)

---

## 🧠 Core Principles

1. **Dify is an "AI orchestration platform," not a conventional automation tool.** The tools in A01–A04 handle deterministic data flows: receive X, do Y. Dify adds a layer of "AI understanding": receive a user's question → AI interprets the meaning → decides where to find information → AI generates an answer → decides what action to trigger. This is a **non-deterministic intelligent pipeline**.

2. **RAG = "giving the AI a reference packet."** RAG (Retrieval-Augmented Generation) is one of Dify's core techniques. Think of it this way: asking an AI a question usually means relying on what it has memorised from training. RAG says: first import your documents (PDFs, Word files, web pages…) into Dify's knowledge base; when a user asks a question, retrieve the relevant passages from the knowledge base, then "stuff" those passages into the model's prompt. The model answers based on your actual documents — not from imagination.

3. **Workflow is a visual AI pipeline editor.** Similar to A01's Node-RED, except every node can be "call an LLM," "search the knowledge base," "run code," or "call an HTTP API." Wire those nodes together and you have an AI workflow.

4. **License: Dify Open Source License (Apache 2.0 + additional terms).** Personal use and internal self-hosted deployment are completely unrestricted. The additional terms mainly address large-scale commercial use and redistribution — they do not affect ordinary users. Read the full text before any commercial use at [github.com/langgenius/dify/blob/main/LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE). (Not legal advice.)

5. **Get your host's confirmation before installing, connecting LLM API keys, or wiring up external actions.** LLM API keys incur costs — always inform your host before proceeding. Confirm before connecting any external service (email, ticketing, database).

---

## 🛠 Key Operations

### Deploy Dify with Docker Compose

**System requirements:** CPU ≥ 2 cores, RAM ≥ 4 GB

```bash
# Clone the repository
git clone https://github.com/langgenius/dify.git
cd dify/docker

# Copy the config file
cp .env.example .env

# Start all services
docker compose up -d
```

> ⚠️ **Get your host's confirmation before starting.** This spins up multiple containers (Web, API, Worker, database, Redis, vector database, etc.) — heavier than the Docker services in previous lessons.

Once the services are ready, open your browser to:

```
http://localhost/install
```

The first visit opens an initialisation screen; follow the prompts to create an admin account.

> 🌐 **Deployment tip:**
> - Docker image pull speed varies by region — configure a registry mirror or pull during off-peak hours if needed
> - Dify itself does not require a VPN to deploy
> - **LLM API connectivity depends on the provider**: OpenAI / Claude require internet access; Qwen, DeepSeek, ERNIE, Kimi, and similar providers work globally (check each provider's docs for regional availability)

### Connect a large language model

Log in to the Dify dashboard → **Settings** → **Model Provider**

Supported providers (examples):

| Provider | Representative Models | Sign-up |
|---|---|---|
| Qwen (Alibaba Cloud) | qwen-turbo, qwen-plus | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| ERNIE (Baidu) | ERNIE-4.0 | [cloud.baidu.com](https://cloud.baidu.com) |
| DeepSeek | deepseek-chat | [platform.deepseek.com](https://platform.deepseek.com) |
| Kimi (Moonshot) | moonshot-v1-8k | [platform.moonshot.cn](https://platform.moonshot.cn) |
| Zhipu GLM | glm-4 | [open.bigmodel.cn](https://open.bigmodel.cn) |
| OpenAI | gpt-4o | [platform.openai.com](https://platform.openai.com) |
| Anthropic | claude-* | [console.anthropic.com](https://console.anthropic.com) |

**Configuration steps:**

1. Apply for an API key on the relevant platform (requires your host's account)
2. Dify Settings → Model Provider → select the provider → enter the API key
3. Click Save; Dify will test the connection

> ⚠️ **The API key must be provided and entered by your host** — you cannot sign up for accounts or fill in keys on their behalf. API calls generate costs — inform your host before proceeding.

### Create a knowledge base (the foundation of RAG)

A knowledge base is the "reference packet you hand to the AI." Steps:

1. Left navigation → **Knowledge** → **Create Knowledge**
2. Upload documents (PDF, Word, TXT, Markdown, web pages, etc.)
3. Wait for Dify to process the documents: chunking → generating vector embeddings
4. Once processing is complete, the knowledge base can be referenced in Workflows or chat applications

> 📌 **Embedding model selection:** Retrieval quality depends on your embedding model. Dify supports multiple embedding models — choose one that fits your language and budget.

### Build the core AI pipeline: question → retrieval → AI answer → trigger action

This is the real task for this lesson. Build it with Dify's **Workflow** editor:

**Step 1: Create a new Workflow application**

1. Homepage → **Create App** → choose **Workflow**
2. Name your application, e.g. "Knowledge Q&A + Auto-notify"

**Step 2: Add a node — START**

The start node receives user input:
- Add an input variable `user_question` (string type) representing the user's question

**Step 3: Add a Knowledge Retrieval node**

1. Click "+" on the canvas → select **Knowledge Retrieval**
2. Select the knowledge base you created
3. Set retrieval parameters: return the top 3 relevant passages
4. Configure the input variable: use `{{user_question}}` as the query
5. Name the output variable `retrieved_docs`

**Step 4: Add an LLM node (AI generates the answer)**

1. Add an **LLM** node
2. Select the LLM you configured
3. Set the System Prompt:
   ```
   You are a professional knowledge assistant. Based on the retrieved documents below, answer the user's question concisely and accurately. If the documents do not contain relevant information, tell the user honestly.
   ```
4. Set the User Message:
   ```
   User question: {{user_question}}
   
   Reference documents:
   {{retrieved_docs}}
   ```
5. Name the output variable `ai_answer`

**Step 5: Add an IF/ELSE condition node (decide whether to trigger an action)**

For example: if the user's question is complaint-related, trigger an additional notification:

1. Add an **IF/ELSE** node
2. Condition: check whether `ai_answer` contains a keyword (or let the LLM classify the intent)
3. True branch → trigger the notification node
4. False branch → output the answer directly

**Step 6: Add an HTTP Request node (trigger an external action)**

If the condition determines that an action should be triggered:
1. Add an **HTTP Request** node
2. Enter the Webhook URL (e.g. a Slack webhook, email service, or ticketing system)
3. Configure the request body to include the `ai_answer` variable

> ⚠️ **The Webhook URL must be provided by your host.** First validate the flow with a test Webhook (e.g. [webhook.site](https://webhook.site)) before wiring up a production bot.

**Step 7: Add an END node (output)**

Configure the final output: `ai_answer`

**Step 8: Save and test**

1. Click **Save** (top-right corner) to save the workflow
2. Click **Preview** or **Run** to enter test mode
3. Enter a test question and observe each node's execution
4. Green = success, red = error; click any node to inspect its input and output data

### Safety checklist

```
□ docker compose up -d confirmed with host before running
□ LLM API key applied for and entered by host personally
□ Documents uploaded to knowledge base are content the host has authorised for processing
□ External actions (Webhook / email) validated with a test address first
□ Host informed before publishing the application, with explanation of which external services it connects to
□ Dify license terms understood; full text reviewed before any commercial use
□ Host's explicit confirmation obtained again before connecting production accounts
```

---

## 📝 Graduation Quiz (must be done for real — submit evidence)

**Task: build a complete AI pipeline — "user question → knowledge base retrieval → AI answer → conditional notification trigger."**

**Phase 1: Understanding (can be done first)**

1. **Explain how RAG works**: using the "reference packet" analogy, walk through RAG's three steps — upload documents → retrieve → inject into prompt. Why is RAG more reliable than "relying solely on what the model has memorised"?

2. **Compare Dify and n8n**: both have visual workflow editors. What is the core difference between them? When is Dify the better choice, and when is n8n the better choice?

3. **Why LLM provider choice matters**: why is it important to be able to choose from different LLM providers? Name 2–3 LLM APIs available in different regions and describe their characteristics.

**Phase 2: Hands-on (requires host to confirm installation)**

> ⚠️ **Get your host's confirmation to install Docker and provide an LLM API key before starting this phase.**

4. **Start Dify**: run `docker compose up -d`, wait until ready, then screenshot `http://localhost/install` or the main dashboard.

5. **Configure at least one LLM provider**: have your host enter the API key, then screenshot Settings → Model Provider showing the model is connected.

6. **Create a knowledge base**: upload at least one document (any text file will do), wait for processing to finish, then screenshot the knowledge base contents list.

7. **Build the 5-node AI pipeline**: START → Knowledge Retrieval → LLM → IF/ELSE → END (+ HTTP Request). Screenshot the complete connected workflow diagram.

8. **Test run**: in Preview mode, enter a test question and screenshot the execution result of each node — especially the LLM node's input (the retrieved documents) and output (the AI answer).

9. **Create a skill card**: capture "Dify startup command + model configuration steps + RAG pipeline node structure + safety checklist" as `skills/dify-rag-workflow.md`.

> ⚠️ **Safety boundaries — a reminder:**
> - `docker compose up -d` — **get host's confirmation before running**
> - LLM API key — **host enters it personally; it incurs costs**
> - Knowledge base documents — **only upload content the host has authorised**
> - External Webhooks / actions — **use a test address first**

---

## 🎓 Completion Criteria

- [ ] You can clearly explain RAG's three-step process using the "reference packet" analogy
- [ ] You can articulate the core difference between Dify and n8n, and which scenarios suit each
- [ ] You can name at least 3 LLM APIs and describe their characteristics
- [ ] You successfully started Dify locally, configured an LLM, and created a knowledge base (screenshots on file)
- [ ] You built a complete 5-node AI pipeline and tested it successfully (screenshots on file)
- [ ] You deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback described in [School Rules §4](../../../校规.md)) has marked this "passed"

All boxes checked and examiner approved — log it on your progress card and move on to the next lesson.
