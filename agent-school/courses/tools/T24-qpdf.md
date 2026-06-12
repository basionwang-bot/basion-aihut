# 第 T24 课 · qpdf 拆分/合并/旋转/解密 PDF

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:qpdf 官方文档 · [qpdf.readthedocs.io](https://qpdf.readthedocs.io/en/stable/) · [github.com/qpdf/qpdf](https://github.com/qpdf/qpdf)

---

## 📖 你要学会什么

学完这一课,你能用 qpdf 在命令行里"手术"PDF:把一份 100 页的合同拆成每章一个文件、把多份报告合并成一份、把扫描件的方向转正、给 PDF 加密或去除密码——全程不需要 Adobe Acrobat,不需要在线工具,本地搞定。

想象 PDF 是一叠装订好的文件。qpdf 就是你的**文件外科医生**:拿出手术刀(命令行),切几页、拼几份、翻个面、上把锁——精准、快速、不破坏原始内容。更棒的是:qpdf 操作的是 PDF 的底层结构,不重新渲染,文字清晰度、字体、表格都原汁原味地保留下来。

qpdf 是 C++ 编写的开源命令行工具,由 Jay Berkenbilt 维护,截至 2025 年稳定版为 qpdf 11.x,专注于 PDF 结构转换,是处理 PDF 文件最可靠的底层工具之一。Python 侧可用同名的 `pypdf`(之前叫 PyPDF2)或 `pikepdf` 包调用类似功能,但命令行 qpdf 功能更全。

**官方资料:**
- 官方文档: [qpdf.readthedocs.io/en/stable/](https://qpdf.readthedocs.io/en/stable/)
- GitHub 仓库: [github.com/qpdf/qpdf](https://github.com/qpdf/qpdf)
- 命令行参考: [qpdf.readthedocs.io/en/stable/cli.html](https://qpdf.readthedocs.io/en/stable/cli.html)
- pikepdf(Python 封装,基于 qpdf): [pikepdf.readthedocs.io](https://pikepdf.readthedocs.io/en/latest/)

---

## 🧠 核心原则(内化成习惯)

1. **qpdf 不渲染内容,只重组 PDF 结构——所以又快又无损。** 和重新打印 PDF 不同,qpdf 操作的是 PDF 内部的页面对象和字节流,不经过任何渲染引擎。这意味着操作再多次,文字清晰度永远不变,速度也极快(合并 100 页 PDF 通常不到 1 秒)。

2. **命令骨架:`qpdf [输入选项] 输入文件 [操作选项] 输出文件`。** 和 ffmpeg 类似,qpdf 的命令也是"输入 → 操作 → 输出"三段式。输入和输出都是文件路径,中间夹操作选项。

3. **页码从 1 开始,支持范围语法 `z` 表示最后一页。** `--pages . 1-10 --` 表示取第 1~10 页;`--pages . 5-z --` 表示从第 5 页到最后一页;`--pages . 1,3,5 --` 表示只取第 1、3、5 页。这个页范围语法是 qpdf 的特色,记住就能做各种切割。

4. **合并多个 PDF 用 `--pages` 语法,点(`.`)代表当前输入文件。** 合并时要先指定"空白"输入或第一个文件,然后用 `--pages file1.pdf 1-z file2.pdf 1-z --` 逐个指定来源和页范围。初看有点绕,但实际上套路固定,背住模板就行。

5. **解密只能用在"你有权使用这份 PDF"的场景。** qpdf 能去除 PDF 的"打印限制"或"复制限制"(即所谓的 owner password 权限),也能在知道密码的前提下解密 user password。用这个功能前确认:你是这份 PDF 的合法持有人,或者有明确的授权——这是法律和道德的底线。

---

## 🛠 操作要点

### 安装

qpdf 是系统级命令行工具:

```bash
# macOS (Homebrew)
brew install qpdf

# Ubuntu / Debian
sudo apt install qpdf

# CentOS / RHEL
sudo yum install qpdf

# Windows
# 从官方 GitHub Release 下载安装包:
# https://github.com/qpdf/qpdf/releases
# 解压后把 bin/ 目录加入系统 PATH

# 验证安装
qpdf --version

# Python 封装(pikepdf,基于 qpdf,功能更丰富)
pip install pikepdf
```

> ⚠️ **系统级安装,未经主人确认不得真装真跑,只先给方案。**
>
> 🇨🇳 **国内提示**:apt/brew 安装通常较快,不依赖境外模型,网络问题较小。

### 常用操作

```bash
# ── 检查 PDF 信息 ──
qpdf --show-pages input.pdf          # 列出所有页面信息
qpdf --check input.pdf               # 检查 PDF 结构是否有问题

# ── 拆分 PDF ──
# 提取第 1~5 页
qpdf --empty --pages input.pdf 1-5 -- chapter1.pdf

# 提取第 6 页到最后一页
qpdf --empty --pages input.pdf 6-z -- chapter2.pdf

# 只提取第 1、3、5 页
qpdf --empty --pages input.pdf 1,3,5 -- selected.pdf

# 批量拆成单页(Shell 循环)
for i in $(seq 1 $(qpdf --show-npages input.pdf)); do
    qpdf --empty --pages input.pdf $i -- "output/page_${i}.pdf"
done

# ── 合并 PDF ──
# 把 file1.pdf 和 file2.pdf 合并(file1 在前)
qpdf --empty --pages file1.pdf 1-z file2.pdf 1-z -- merged.pdf

# 合并三个或更多文件
qpdf --empty --pages a.pdf 1-z b.pdf 1-z c.pdf 1-z -- merged_all.pdf

# ── 旋转页面 ──
# 把所有页顺时针旋转 90 度
qpdf input.pdf --rotate=+90 output.pdf

# 只旋转第 1 页
qpdf input.pdf --rotate=+90:1 output.pdf

# 逆时针旋转(−90 度)
qpdf input.pdf --rotate=-90 output.pdf

# 旋转 180 度
qpdf input.pdf --rotate=180 output.pdf

# ── 加密与解密 ──
# 加密(设置 user password 和 owner password)
qpdf --encrypt 用户密码 主人密码 256 -- input.pdf encrypted.pdf
#   第三个参数是 key length:40 / 128 / 256(推荐 256)

# 解密(知道密码的前提下)
qpdf --decrypt --password=已知密码 encrypted.pdf decrypted.pdf

# 去除"打印/复制"限制(仅限 owner password 权限的 PDF)
qpdf --decrypt input.pdf unlocked.pdf

# ── 线性化(优化网页阅读) ──
qpdf --linearize input.pdf optimized.pdf

# ── 压缩 PDF 体积 ──
qpdf --compress-streams=y --object-streams=generate input.pdf compressed.pdf
```

### Python 封装:用 pikepdf(基于 qpdf)

```python
import pikepdf
import os

def split_pdf(src: str, output_dir: str):
    """把 PDF 拆成单页,每页一个文件"""
    os.makedirs(output_dir, exist_ok=True)
    with pikepdf.open(src) as pdf:
        total = len(pdf.pages)
        for i, page in enumerate(pdf.pages, 1):
            out = pikepdf.Pdf.new()
            out.pages.append(page)
            out.save(os.path.join(output_dir, f"page_{i:03d}.pdf"))
    print(f"拆分完成:{total} 页 → {output_dir}/")

def merge_pdfs(src_list: list, dst: str):
    """合并多个 PDF 文件"""
    merged = pikepdf.Pdf.new()
    for src in src_list:
        with pikepdf.open(src) as pdf:
            merged.pages.extend(pdf.pages)
    merged.save(dst)
    print(f"合并 {len(src_list)} 个文件 → {dst}({len(merged.pages)} 页)")

def rotate_pages(src: str, dst: str, degrees: int = 90, pages: list = None):
    """旋转指定页面(pages=None 表示全部页)"""
    with pikepdf.open(src) as pdf:
        target_pages = pages or range(len(pdf.pages))
        for i in target_pages:
            page = pdf.pages[i]
            page.rotate(degrees, relative=True)
        pdf.save(dst)
    print(f"旋转 {degrees}° 完成 → {dst}")

def decrypt_pdf(src: str, dst: str, password: str = ""):
    """解密 PDF(需知道密码)"""
    with pikepdf.open(src, password=password) as pdf:
        pdf.save(dst)
    print(f"解密完成 → {dst}")

# 示例(需主人确认后才能真跑)
# split_pdf("big_report.pdf", "output/pages/")
# merge_pdfs(["part1.pdf", "part2.pdf", "part3.pdf"], "output/full_report.pdf")
```

### qpdf 命令速查

| 想干嘛 | 命令 |
|--------|------|
| 查总页数 | `qpdf --show-npages input.pdf` |
| 查页面信息 | `qpdf --show-pages input.pdf` |
| 提取指定页 | `qpdf --empty --pages input.pdf 1-5 -- out.pdf` |
| 合并多文件 | `qpdf --empty --pages a.pdf 1-z b.pdf 1-z -- out.pdf` |
| 旋转全部页 | `qpdf input.pdf --rotate=+90 out.pdf` |
| 旋转指定页 | `qpdf input.pdf --rotate=+90:1-3 out.pdf` |
| 加密 | `qpdf --encrypt 密码 密码 256 -- in.pdf out.pdf` |
| 解密 | `qpdf --decrypt --password=密码 in.pdf out.pdf` |
| 去限制 | `qpdf --decrypt in.pdf out.pdf` |
| 压缩 | `qpdf --compress-streams=y in.pdf out.pdf` |
| 验证结构 | `qpdf --check in.pdf` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"PDF 批量整理"的完整方案,含可验证的最小测试。**

场景:主人收到一批 PDF 报告(有些横向扫描件需要旋转,有些需要按章节拆分),需要:① 把一份多章合集 PDF 拆成每章一个文件;② 把各章旋转纠正到竖向阅读方向;③ 最后把所有章节重新合并成一份带目录顺序的完整版。

你需要完成:

1. **写出完整的 qpdf 命令序列**:
   - 查看 `report.pdf` 总页数的命令
   - 假设共 30 页,分成三章(1-10 / 11-20 / 21-30)的三条拆分命令
   - 把第 1 章旋转 90 度纠正方向的命令
   - 把三章重新合并成 `output/full.pdf` 的命令

2. **写出等价的 Python pikepdf 脚本**:
   - 函数化封装(split / rotate / merge)
   - 给出完整调用示例

3. **写出可验证的最小测试**:用代码生成一个 3 页的测试 PDF(reportlab),再用 pikepdf 拆成 3 个单页文件,验证每个文件有且只有 1 页——这部分装好环境后可以直接跑。

4. **写出验收标准**:
   - 每章 PDF 页数符合预期(用 `qpdf --show-npages` 验证)
   - 合并后的 `full.pdf` 页数等于各章页数之和
   - 旋转后的 PDF 用阅读器打开显示方向正确

5. **写出安全提示**:
   - 解密 PDF 只用于你有权使用的文件
   - **未经主人确认不得真装真跑**
   - 批量操作前备份原始文件

6. **沉淀技能卡**到 `agent-school/skills/qpdf-operations.md`。

> ⚠️ **安全边界**:第 3 步的最小测试在装好环境后可以直接跑验证;批量脚本和 qpdf 命令**必须先得到主人明确确认再执行**。

---

## 🎓 过关标准

- [ ] 你写出了拆分、合并、旋转三类操作的完整 qpdf 命令(含参数解释)
- [ ] 你写出了 pikepdf 封装的 Python 脚本
- [ ] 你能解释 qpdf 页范围语法(`1-5`、`6-z`、`1,3,5`)
- [ ] 你给出了可直接运行的最小验证脚本(代码生成测试 PDF + pikepdf 拆分验证)
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/qpdf-operations.md`](../../skills/qpdf-operations.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 qpdf/pikepdf 拆分/合并/旋转/解密 PDF

- **什么时候用**:需要重组 PDF 页面结构(拆分/合并/旋转/加解密)
- **来自**:T24 课 qpdf

## 步骤
1. 安装:brew/apt install qpdf; pip install pikepdf
2. 查总页数:qpdf --show-npages input.pdf
3. 拆分:qpdf --empty --pages input.pdf 起-止 -- output.pdf
4. 合并:qpdf --empty --pages a.pdf 1-z b.pdf 1-z -- merged.pdf
5. 旋转:qpdf input.pdf --rotate=+90 output.pdf(+90/−90/180)
6. 解密:qpdf --decrypt --password=密码 in.pdf out.pdf
7. Python:用 pikepdf.open/pdf.pages.extend/pdf.save

## 验证
- qpdf --show-npages output.pdf 确认页数
- qpdf --check output.pdf 确认结构无误

## 注意
- qpdf 操作无损(不重渲染),速度极快
- 页范围:1-z 表示到最后一页;z 代表最后页码
- 解密只用于你有权使用的 PDF
- 批量操作前先备份原始文件
- pikepdf 是 qpdf 的 Python 封装,API 更友好
```
