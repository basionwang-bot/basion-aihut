# 第 T21 课 · ImageMagick 命令行批处理图片

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:ImageMagick 官方文档 · [imagemagick.org/script/command-line-tools.php](https://imagemagick.org/script/command-line-tools.php) · [imagemagick.org/script/mogrify.php](https://imagemagick.org/script/mogrify.php)

---

## 📖 你要学会什么

学完这一课,你能用 ImageMagick 的命令行工具——主要是 `convert`(单文件处理)和 `mogrify`(批量原地修改)——在终端里完成几乎所有图片处理任务:格式转换、缩放、裁剪、加水印、旋转、拼合多图、调整亮度对比度……一行命令,搞定。

想象你手头有一个装满图片的文件夹,你想把里面所有 PNG 变成 JPEG、顺便缩到 50%、再加个灰色边框。如果用 Pillow(T20 课)要写十几行代码,但用 ImageMagick 只需要**一行 `mogrify` 命令**——它就像一个随叫随到的"图片瑞士军刀",几乎没有它干不了的图片操作。

ImageMagick 是 1987 年诞生的开源图像处理工具集,已在全球服务器上运行了 30+ 年,是处理图片的底层基础设施之一(WordPress、Discourse 等都在后台调用它)。当前稳定版为 ImageMagick 7.x。

**官方资料:**
- 官方主页: [imagemagick.org](https://imagemagick.org/)
- convert 命令参考: [imagemagick.org/script/convert.php](https://imagemagick.org/script/convert.php)
- mogrify 命令参考: [imagemagick.org/script/mogrify.php](https://imagemagick.org/script/mogrify.php)
- 命令行选项大全: [imagemagick.org/script/command-line-options.php](https://imagemagick.org/script/command-line-options.php)

---

## 🧠 核心原则(内化成习惯)

1. **`convert` 不改原文件,`mogrify` 会改原文件——搞清楚用哪个。** `convert input.jpg output.png` 把结果存到新文件,原文件不动;`mogrify -resize 50% *.jpg` 会**直接修改**目录里所有 jpg 文件。批量操作前先备份或确认,别把原图毁了。

2. **选项的顺序就是操作的顺序,顺序不同结果不同。** ImageMagick 的命令行选项是按左到右顺序执行的,就像流水线一道道工序。先缩放再加水印,和先加水印再缩放,最终水印的大小会不一样。记住这个流水线心智模型。

3. **`-resize` 和 `-thumbnail` 都能缩放,后者更快但精度低。** `-resize 800x600` 保持宽高比缩放;`-thumbnail 800x600` 专门为缩略图优化(会先激进采样再细化),速度快一倍,但不适合需要高精度的场景。

4. **`%` 是相对缩放,不加 `%` 是绝对像素。** `-resize 50%` 是缩到原来的一半;`-resize 800x600` 是目标像素上限(保持比例,短边按比例缩);`-resize 800x600!` 加感叹号才是强制拉伸到精确尺寸(不保持比例)。

5. **ImageMagick 7 用 `magick` 命令,ImageMagick 6 用 `convert`。** 系统上装的版本不同,主命令名不同。用 `magick -version` 查版本;如果是 7.x 优先用 `magick convert` 或直接 `magick`;如果是 6.x 用 `convert`。写脚本时先检测版本。

---

## 🛠 操作要点

### 安装

ImageMagick 是系统级工具,不是 Python 包:

```bash
# macOS (Homebrew)
brew install imagemagick

# Ubuntu / Debian
sudo apt update && sudo apt install imagemagick

# CentOS / RHEL
sudo yum install ImageMagick

# Windows
# 从官网下载安装包: https://imagemagick.org/script/download.php#windows
# 安装时勾选"Add application directory to your system path"

# 验证安装(ImageMagick 7 用 magick,6 用 convert)
magick -version
# 或
convert -version
```

> ⚠️ **系统级安装,未经主人确认不得真装真跑,只先给方案。**
>
> 🇨🇳 **国内网络提示**:macOS Homebrew 安装 ImageMagick 会下载一堆依赖(包含 libjpeg、libpng、libwebp 等),可能需要几分钟到几十分钟;可先问主人是否已安装 (`magick -version` 能跑就代表已有)。

### 检查版本与功能

```bash
# 查看版本和支持的格式
magick -version
magick -list format | grep -i "JPEG\|PNG\|WEBP"
```

### convert 单文件处理

```bash
# 格式转换:PNG 转 JPEG
magick convert input.png output.jpg

# 缩放:等比缩到宽度 800px(高度自动)
magick convert input.jpg -resize 800x output_800w.jpg

# 缩放:等比,长边不超过 1200px
magick convert input.jpg -resize 1200x1200 output.jpg

# 强制缩放到 800×600(不保持比例,会拉伸)
magick convert input.jpg -resize 800x600! output.jpg

# 居中裁剪正方形(先缩再裁)
magick convert input.jpg -resize 800x800^ -gravity center -extent 800x800 output_square.jpg
#   ^ 号:短边等比缩放到 800(可能超出另一边),再用 -extent 居中裁

# 旋转(自动按 EXIF 方向调整用 -auto-orient)
magick convert input.jpg -rotate 90 output_rotated.jpg
magick convert input.jpg -auto-orient output_corrected.jpg

# 调整质量(JPEG 压缩,85 是常用值)
magick convert input.jpg -quality 85 output_compressed.jpg

# 加文字水印(右下角)
magick convert input.jpg \
  -gravity SouthEast \
  -fill "rgba(255,255,255,0.6)" \
  -pointsize 24 \
  -annotate +20+20 "© 品牌名" \
  output_watermark.jpg

# 加图片水印(logo 叠加到右下角)
magick convert input.jpg logo.png \
  -gravity SouthEast -geometry +20+20 \
  -composite output_logo.jpg

# 转灰度
magick convert input.jpg -colorspace Gray output_gray.jpg

# 调整亮度/对比度(-100 到 +100)
magick convert input.jpg -brightness-contrast 10x15 output_adjusted.jpg
```

### mogrify 批量原地处理

```bash
# ⚠️ mogrify 直接修改原文件,批量操作前先备份!

# 批量转换:把当前目录所有 PNG 转为 JPEG(原 PNG 保留,生成同名 jpg)
magick mogrify -format jpg *.png

# 批量缩放:所有 jpg 缩到宽度 800px
magick mogrify -resize 800x *.jpg

# 批量加水印并输出到子目录(用 -path 指定输出目录,不改原文件!)
mkdir -p output
magick mogrify -path output -resize 800x -quality 85 *.jpg
#   ✅ 加了 -path output 就不改原文件了,推荐加这个

# 批量转为 WebP 并输出到 output 目录
magick mogrify -path output -format webp -quality 85 *.jpg
```

### 在 Python 里调用(subprocess)

```python
import subprocess
import os

def imagemagick_resize(src: str, dst: str, max_side: int = 1200, quality: int = 85) -> bool:
    """用 ImageMagick 缩放并保存图片"""
    cmd = [
        "magick", "convert", src,
        "-resize", f"{max_side}x{max_side}",
        "-quality", str(quality),
        dst
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"错误: {result.stderr}")
        return False
    return os.path.exists(dst)

def batch_mogrify(input_dir: str, output_dir: str,
                  max_side: int = 1200, quality: int = 85):
    """批量处理目录内所有 JPEG"""
    os.makedirs(output_dir, exist_ok=True)
    cmd = [
        "magick", "mogrify",
        "-path", output_dir,
        "-resize", f"{max_side}x{max_side}",
        "-quality", str(quality),
        os.path.join(input_dir, "*.jpg")
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0
```

### 常用选项速查

| 选项 | 含义 |
|------|------|
| `-resize 800x` | 等比缩放,宽度 800 |
| `-resize x600` | 等比缩放,高度 600 |
| `-resize 800x600` | 等比缩放,长边不超过 800×600 |
| `-resize 800x600!` | 强制拉伸到 800×600 |
| `-resize 800x800^` | 短边缩到 800(可能超出) |
| `-gravity Center` | 定位基准:居中 |
| `-gravity SouthEast` | 定位基准:右下角 |
| `-extent WxH` | 裁剪/扩展画布到指定尺寸 |
| `-quality N` | JPEG/WebP 质量(1-95) |
| `-format webp` | mogrify 输出格式 |
| `-path dir` | mogrify 输出目录(不改原文件) |
| `-annotate +x+y "文字"` | 在指定偏移位置写文字 |
| `-composite` | 合并两张图(叠加水印图) |
| `-auto-orient` | 按 EXIF 自动旋转 |
| `-colorspace Gray` | 转灰度 |
| `-strip` | 去除 EXIF 等元数据(减小文件) |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"批量图片标准化"的完整命令行方案。**

场景:主人有一批摄影照片(混合 JPEG/PNG),需要:① 统一缩到最长边 1200px;② 去除 EXIF 隐私信息;③ 转为 JPEG(quality=88);④ 右下角加文字水印 "© basion 2026";⑤ 输出到 `output/` 目录,不改原文件。

你需要完成:

1. **写出完整的命令方案**:
   - 一条 `mogrify` 命令批量处理所有 JPEG(用 `-path output` 保护原文件)
   - 一条针对 PNG 的 `convert` + `mogrify` 组合命令
   - 展示加水印的完整参数

2. **写出等价的 Python subprocess 脚本**:
   - 遍历目录,分别处理 JPEG 和 PNG
   - 对每个文件构造并执行 `magick convert` 命令
   - 记录成功/失败到日志

3. **写出验收标准**:
   - 用 `magick identify output/*.jpg` 核查尺寸(最长边 ≤ 1200)
   - 用 `magick identify -verbose output/xxx.jpg | grep -i exif` 确认 EXIF 已清除

4. **写出 convert vs mogrify 的选择逻辑**:说清楚什么时候用哪个

5. **写出安全提示**:
   - mogrify 不加 `-path` 会直接覆盖原文件,危险
   - **未经主人确认不得真装真跑**

6. **沉淀技能卡**到 `agent-school/skills/imagemagick-batch.md`。

> ⚠️ **安全边界**:这一课的毕业测验是**产出方案**,不是真跑。命令和脚本的实际执行**必须先得到主人明确确认**。

---

## 🎓 过关标准

- [ ] 你写出了完整的 `mogrify -path` 批量命令(含缩放、去EXIF、加水印、转格式)
- [ ] 你能解释 `convert` 和 `mogrify` 的核心区别以及各自适用场景
- [ ] 你知道 `-resize 800x800^` 加 `-extent 800x800` 的居中裁剪技巧
- [ ] 你写出了 Python subprocess 封装版本
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/imagemagick-batch.md`](../../skills/imagemagick-batch.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T22 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 ImageMagick 命令行批处理图片

- **什么时候用**:需要一行命令批量处理大量图片(缩放/裁剪/水印/转格式)
- **来自**:T21 课 ImageMagick

## 步骤
1. 验证安装:magick -version(或 convert -version)
2. 单文件:magick convert input [选项] output
3. 批量(不改原文件):magick mogrify -path output_dir [选项] *.jpg
4. 居中裁剪正方形:-resize NxN^ -gravity center -extent NxN
5. 加文字水印:-gravity SouthEast -fill "rgba(255,255,255,0.6)" -pointsize 24 -annotate +20+20 "文字"
6. 去 EXIF 元数据:-strip
7. Python 调用:subprocess.run(["magick", "convert", ...])

## 验证
- magick identify output/*.jpg 核查尺寸和格式
- returncode == 0 且输出目录非空

## 注意
- mogrify 不加 -path 会覆盖原文件!必须加 -path 指定输出目录
- ImageMagick 7 用 magick 命令;6 用 convert/mogrify
- 选项顺序就是流水线顺序,顺序不同结果不同
- 安装前先 magick -version 检查是否已存在
```
