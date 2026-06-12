# 第 T31 课 · Docker 环境打包

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:Docker 官方文档 · [docs.docker.com/get-started/](https://docs.docker.com/get-started/) · [hub.docker.com](https://hub.docker.com)

---

## 📖 你要学会什么

学完这一课,你能理解 Docker 的核心思路,写出一个 Dockerfile,把一个项目的运行环境"装进盒子"——下次换台机器,一行命令就能把它原样复现,再也不会出现"我这里能跑,你那里不行"的玄学问题。

想象这样一个场景:你精心布置了一个工作台——装了特定版本的 Python、特定版本的依赖库、特定的环境变量,花了半天才调好。现在你要把这套工作台"快递"给另一个人。怎么快递?**Docker 干的事就是把整个工作台连同抽屉里的工具一起装进一个标准化的集装箱**,对方收到集装箱,打开就是一模一样的工作台,一秒钟都不用再配置。

这个"集装箱"就是 **容器(container)**,装箱的配方叫 **Dockerfile**,打包好的成品叫 **镜像(image)**。

**官方资料:**
- 官方入门文档: [docs.docker.com/get-started/](https://docs.docker.com/get-started/)
- Dockerfile 参考: [docs.docker.com/reference/dockerfile/](https://docs.docker.com/reference/dockerfile/)
- Docker Hub(镜像仓库): [hub.docker.com](https://hub.docker.com)
- 国内镜像加速说明: [阿里云镜像加速](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

---

## 🧠 核心原则

1. **镜像是"快照",容器是"运行中的实例"。** 就像 ISO 光盘镜像和装进光驱跑起来的系统——镜像是静态的配方,容器是按配方跑起来的活的进程。一个镜像可以同时跑出 10 个容器。

2. **Dockerfile 从上往下读,每一行都是一层。** Docker 构建镜像时,每条指令产生一个"缓存层"——如果你改了第 5 行,第 1~4 行的缓存仍然有效,只重建第 5 行之后的内容。所以**把"不常变的"放前面,常变的(比如你自己的代码)放后面**,可以大幅加快重建速度。

3. **把秘密留在外面,别烧进镜像。** 密码、API Key、数据库连接串——这些**绝对不能写进 Dockerfile 或镜像里**。镜像一旦推送到仓库,就相当于公开了。秘密应该通过环境变量或 Docker Secrets 在运行时注入。

4. **用 .dockerignore 减肥。** 就像 .gitignore 一样,`.dockerignore` 文件告诉 Docker 构建时哪些文件不要打包进去——比如 `node_modules/`、`.git/`、本地日志。不加这个,一个几百 MB 的 `node_modules` 会被装进镜像,慢且大。

5. **在本仓库运行 Docker 前必须先问主人。** Docker 涉及系统级别的资源(网络、存储、进程隔离),本课的毕业测验是**写好配方**,真正的 `docker build` 和 `docker run`——**必须先征得主人明确确认再执行**。

---

## 🛠 操作要点

### 检查 Docker 是否已安装

```bash
docker --version
# 输出类似: Docker version 24.0.7, build afdd53b
```

> 如果没有 Docker,安装方法见 [docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)。国内用户安装后建议配置镜像加速(阿里云/腾讯云都有免费加速地址),否则拉取镜像非常慢。**安装前先问主人。**

### 一个最小的 Dockerfile(Python 项目示例)

```dockerfile
# 第一行:选基础镜像——就像选"工作台的地基"
# python:3.11-slim 比 python:3.11 小很多(去掉了不常用的工具)
FROM python:3.11-slim

# 声明工作目录(后续命令都在这里执行)
WORKDIR /app

# 先只复制依赖清单——利用缓存层加速构建
# 如果只改了代码但没改 requirements.txt,这一层会命中缓存
COPY requirements.txt .

# 安装依赖
# --no-cache-dir 不保存 pip 缓存,让镜像更小
RUN pip install --no-cache-dir -r requirements.txt \
    -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/

# 最后才复制代码——常变的放最后
COPY . .

# 声明容器启动时执行的命令
CMD ["python", "main.py"]
```

### 构建镜像

```bash
# -t 给镜像起个名字和标签(名字:版本)
# . 表示 Dockerfile 在当前目录
docker build -t my-python-app:v1.0 .

# 构建完查看本地镜像列表
docker images
```

### 运行容器

```bash
# 最基础的运行
docker run my-python-app:v1.0

# 常用参数:
# -d          后台运行(不占终端)
# --rm        容器退出后自动删除
# -p 8080:80  把本机 8080 端口映射到容器内的 80 端口
# -v /本机路径:/容器路径  挂载目录(容器里改了,本机也保存)
# -e KEY=value  传入环境变量
docker run -d --rm -p 8080:80 -e API_KEY=xxx my-python-app:v1.0
```

### .dockerignore 示例

```
# .dockerignore 文件——放在 Dockerfile 同目录
__pycache__/
*.pyc
.env
.git/
node_modules/
*.log
output/
```

### 常用 Docker 命令速查

| 想干嘛 | 命令 |
|--------|------|
| 构建镜像 | `docker build -t 名字:版本 .` |
| 列出本地镜像 | `docker images` |
| 运行容器 | `docker run 镜像名` |
| 列出运行中的容器 | `docker ps` |
| 查看容器日志 | `docker logs 容器ID` |
| 进入运行中的容器 | `docker exec -it 容器ID bash` |
| 停止容器 | `docker stop 容器ID` |
| 删除容器 | `docker rm 容器ID` |
| 删除镜像 | `docker rmi 镜像名` |

### 国内拉取镜像提速

Docker Hub 在国内经常很慢。可以在 Docker 配置文件里加镜像加速地址:

```json
// /etc/docker/daemon.json (Linux) 或 Docker Desktop 设置里
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.cn-hangzhou.aliyuncs.com"
  ]
}
```

> 配完重启 Docker 服务生效:`sudo systemctl restart docker`。**修改系统配置前先问主人。**

---

## 📝 毕业测验(必须真做,交证据)

**任务:为一个真实的 Python 小脚本写一套完整的容器化方案。**

选定项目:一个 Python 脚本 `main.py`,功能是读取一个 `input.txt` 文件,统计词频,把结果写入 `output/result.json`。

你需要完成:

1. **写出项目文件结构**:
   ```
   my-wordcount/
   ├── main.py          # 词频统计脚本
   ├── requirements.txt # 依赖(如果只用标准库可以为空)
   ├── Dockerfile       # 容器化配方
   ├── .dockerignore    # 排除不需要的文件
   └── input.txt        # 测试输入
   ```

2. **写出完整的 `main.py`**:
   ```python
   import json, os
   from collections import Counter

   with open("input.txt", encoding="utf-8") as f:
       words = f.read().split()

   counts = dict(Counter(words).most_common(10))
   os.makedirs("output", exist_ok=True)

   with open("output/result.json", "w", encoding="utf-8") as f:
       json.dump(counts, f, ensure_ascii=False, indent=2)

   print(f"完成!前 10 词已写入 output/result.json")
   ```

3. **写出完整的 `Dockerfile`**,要求:
   - 基础镜像用 `python:3.11-slim`
   - 工作目录 `/app`
   - 挂载思路:把本机的 `input.txt` 和 `output/` 挂载进容器,而不是烧进镜像

4. **写出构建和运行命令**:
   ```bash
   # 构建(先问主人再执行)
   docker build -t wordcount:v1 .

   # 运行(把本机当前目录的 input.txt 和 output/ 挂载进容器)
   docker run --rm \
     -v "$(pwd)/input.txt:/app/input.txt" \
     -v "$(pwd)/output:/app/output" \
     wordcount:v1
   ```

5. **写出验收标准**:
   - `docker build` 退出码为 0,无报错
   - `docker run` 结束后 `output/result.json` 文件存在
   - `result.json` 里包含至少 1 条词频记录
   - 脚本在容器内运行,不依赖本机 Python 环境

6. **沉淀技能卡**:把 Dockerfile 关键指令、构建/运行命令、.dockerignore 模板沉淀成 `skills/docker.md`。

> ⚠️ **安全边界(守住这条线):** 这一课的毕业测验是**产出方案 + 写好所有文件**,不是擅自真跑。`docker build` 和 `docker run`——**必须先得到主人明确确认再执行**。涉及修改 Docker 配置(`/etc/docker/daemon.json`)同样需要先问主人。镜像里**绝不写入**密码、API Key 等秘密信息。

---

## 🎓 过关标准

- [ ] 你写出了一个**完整的 Dockerfile**(含基础镜像、WORKDIR、COPY、RUN、CMD)
- [ ] 你能说清楚**镜像 vs 容器**的区别(类比光盘镜像和跑起来的系统)
- [ ] 你写出了**构建和运行命令**,包含 `-v` 挂载和 `-e` 环境变量的用法
- [ ] 你写了 `.dockerignore`,知道为什么要排除 `__pycache__`、`.env`、`.git`
- [ ] 你写出了**验收标准**(可核查的条件,不是"感觉行")
- [ ] 你写清楚了**安全边界**:秘密不进镜像,build/run 前先征得主人确认
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T32 课。
