> 🌐 English ｜ [中文](../../tools/T31-docker.md)

# Lesson T31 · Docker: Packaging Your Environment

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: Docker official docs · [docs.docker.com/get-started/](https://docs.docker.com/get-started/) · [hub.docker.com](https://hub.docker.com)

---

## 📖 What you'll learn

After this lesson, you'll understand Docker's core idea, be able to write a Dockerfile, and "box up" a project's runtime environment — so that next time you switch machines, one command brings it back exactly as it was. No more "works on my machine, not on yours" mysteries.

Picture this scenario: you've carefully set up a workbench — installed a specific version of Python, specific versions of dependencies, specific environment variables — and it took you half a day to get everything just right. Now you need to "ship" this entire workbench to someone else. How do you ship a workbench? **Docker takes the whole thing — workbench, drawers, and every tool inside — and packs it into a standardized shipping container.** The recipient opens the container and gets an identical workbench, ready in seconds, with nothing left to configure.

That "container" is a **container**, the packing recipe is a **Dockerfile**, and the finished packaged product is an **image**.

**Official resources:**
- Official getting started guide: [docs.docker.com/get-started/](https://docs.docker.com/get-started/)
- Dockerfile reference: [docs.docker.com/reference/dockerfile/](https://docs.docker.com/reference/dockerfile/)
- Docker Hub (image registry): [hub.docker.com](https://hub.docker.com)

---

## 🧠 Core principles (internalize these as habits)

1. **An image is a "snapshot"; a container is a "running instance."** Think of a CD-ROM image and the live system running from that disc. The image is a static recipe; the container is the process that starts from that recipe. One image can spawn 10 containers simultaneously.

2. **Dockerfile is read top to bottom, and each line is a layer.** When Docker builds an image, each instruction produces a cached layer. If you change line 5, lines 1–4 are still cached and only lines 5 onward are rebuilt. So **put the things that rarely change at the top, and the things that change often (like your code) at the bottom** — this dramatically speeds up rebuilds.

3. **Keep secrets outside the image — never bake them in.** Passwords, API keys, database connection strings — these must **never appear in your Dockerfile or image**. Once an image is pushed to a registry, it's effectively public. Secrets should be injected at runtime via environment variables or Docker Secrets.

4. **Use `.dockerignore` to keep images lean.** Just like `.gitignore`, a `.dockerignore` file tells Docker which files to exclude from the build context — for example, `node_modules/`, `.git/`, local logs. Without it, a several-hundred-MB `node_modules` directory gets packed into the image, making it slow and bloated.

5. **Always ask the owner before running Docker commands in this repository.** Docker operates at the system level (networking, storage, process isolation). The graduation test for this lesson is **producing the recipe** — the actual `docker build` and `docker run` commands **must only be executed after getting explicit confirmation from the owner.**

---

## 🛠 How to do it

### Check whether Docker is installed

```bash
docker --version
# Output similar to: Docker version 24.0.7, build afdd53b
```

> If Docker isn't installed, see [docs.docker.com/engine/install/](https://docs.docker.com/engine/install/). After installing, consider configuring a registry mirror to speed up image pulls (mirrors are available from cloud providers). **Ask the owner before installing.**

### A minimal Dockerfile (Python project example)

```dockerfile
# Line 1: choose a base image — the "foundation of the workbench"
# python:3.11-slim is much smaller than python:3.11 (removes rarely used tools)
FROM python:3.11-slim

# Set the working directory (all subsequent commands run here)
WORKDIR /app

# Copy only the dependency manifest first — allows cache layer reuse:
# if only the code changed but requirements.txt didn't, this layer is cached
COPY requirements.txt .

# Install dependencies
# --no-cache-dir skips pip's download cache, keeping the image smaller
RUN pip install --no-cache-dir -r requirements.txt

# Copy the code last — frequently changing files go at the bottom
COPY . .

# Command to run when the container starts
CMD ["python", "main.py"]
```

### Build an image

```bash
# -t gives the image a name and tag (name:version)
# . means the Dockerfile is in the current directory
docker build -t my-python-app:v1.0 .

# After building, list local images
docker images
```

### Run a container

```bash
# Most basic run
docker run my-python-app:v1.0

# Common flags:
# -d          run in background (detached)
# --rm        auto-delete container when it exits
# -p 8080:80  map host port 8080 to container port 80
# -v /host/path:/container/path  mount a directory (changes inside container are saved to host)
# -e KEY=value  pass in an environment variable
docker run -d --rm -p 8080:80 -e API_KEY=xxx my-python-app:v1.0
```

### `.dockerignore` example

```
# .dockerignore — place in the same directory as your Dockerfile
__pycache__/
*.pyc
.env
.git/
node_modules/
*.log
output/
```

### Common Docker commands quick reference

| What you want to do | Command |
|---------------------|---------|
| Build an image | `docker build -t name:version .` |
| List local images | `docker images` |
| Run a container | `docker run image_name` |
| List running containers | `docker ps` |
| View container logs | `docker logs container_id` |
| Enter a running container | `docker exec -it container_id bash` |
| Stop a container | `docker stop container_id` |
| Remove a container | `docker rm container_id` |
| Remove an image | `docker rmi image_name` |

### Speeding up image pulls with a registry mirror

Docker Hub can be very slow. You can add mirror addresses to the Docker config:

```json
// /etc/docker/daemon.json (Linux) or inside Docker Desktop settings
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.cn-hangzhou.aliyuncs.com"
  ]
}
```

> Restart the Docker service after editing: `sudo systemctl restart docker`. **Ask the owner before modifying system configuration.**

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: write a complete containerization plan for a real Python script.**

Target project: a Python script `main.py` that reads an `input.txt` file, counts word frequencies, and writes the results to `output/result.json`.

You need to complete:

1. **Write out the project file structure:**
   ```
   my-wordcount/
   ├── main.py          # word frequency script
   ├── requirements.txt # dependencies (can be empty if using stdlib only)
   ├── Dockerfile       # containerization recipe
   ├── .dockerignore    # files to exclude from the build context
   └── input.txt        # test input
   ```

2. **Write the complete `main.py`:**
   ```python
   import json, os
   from collections import Counter

   with open("input.txt", encoding="utf-8") as f:
       words = f.read().split()

   counts = dict(Counter(words).most_common(10))
   os.makedirs("output", exist_ok=True)

   with open("output/result.json", "w", encoding="utf-8") as f:
       json.dump(counts, f, ensure_ascii=False, indent=2)

   print(f"Done! Top 10 words written to output/result.json")
   ```

3. **Write the complete `Dockerfile`,** with these requirements:
   - Base image: `python:3.11-slim`
   - Working directory: `/app`
   - Mount strategy: mount the host's `input.txt` and `output/` into the container rather than baking them into the image

4. **Write the build and run commands:**
   ```bash
   # Build (ask the owner before running)
   docker build -t wordcount:v1 .

   # Run (mount the current directory's input.txt and output/ into the container)
   docker run --rm \
     -v "$(pwd)/input.txt:/app/input.txt" \
     -v "$(pwd)/output:/app/output" \
     wordcount:v1
   ```

5. **Write the acceptance criteria:**
   - `docker build` exits with code 0, no errors
   - After `docker run` completes, `output/result.json` exists
   - `result.json` contains at least 1 word frequency record
   - The script ran inside the container with no dependency on the host Python environment

6. **Distill a skill card:** condense the key Dockerfile instructions, build/run commands, and `.dockerignore` template into `skills/docker.md`.

> ⚠️ **Safety boundary (hold this line):** The graduation test for this lesson is **producing the plan and writing all the files** — not running anything on your own. `docker build` and `docker run` **must only be executed after receiving explicit confirmation from the owner.** Modifying Docker configuration (`/etc/docker/daemon.json`) also requires asking the owner first. **Never put passwords, API keys, or any other secrets inside an image.**

---

## 🎓 Pass criteria

- [ ] You wrote a **complete Dockerfile** (with base image, WORKDIR, COPY, RUN, CMD)
- [ ] You can explain the difference between **image vs. container** (using the CD-ROM/running-system analogy)
- [ ] You wrote the **build and run commands**, including usage of `-v` mounts and `-e` environment variables
- [ ] You wrote a `.dockerignore`, and know why `__pycache__`, `.env`, and `.git` should be excluded
- [ ] You wrote **acceptance criteria** (verifiable conditions, not "feels right")
- [ ] You clearly stated the **safety boundary**: secrets stay out of images; build/run requires owner confirmation
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T32.
