# 第 T20 课 · Pillow 批量图片处理

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:Pillow 官方文档 · [pillow.readthedocs.io](https://pillow.readthedocs.io/en/stable/) · [github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)

---

## 📖 你要学会什么

学完这一课,你能用 Pillow 批量处理图片:统一裁剪尺寸、批量加水印、压缩体积、在不同格式之间转换——一次处理几百张,不用打开任何图片编辑软件。

想象你是一个电商运营,手头有 200 张产品图,需要统一裁成 800×800 的正方形、右下角打上品牌水印、再压缩到 200KB 以内才能上传平台。靠 PS 一张张操作需要 4 小时。用 Pillow 写个脚本,泡一杯茶的功夫 200 张就处理完了——**Pillow 就是你的自动化图片流水线**。

Pillow 是 Python 最主流的图像处理库(PIL 的持续维护分支),支持 30+ 图片格式,是纯 Python 方案里功能和生态最完整的选择。截至 2025 年,稳定版为 Pillow 11.x,要求 Python ≥ 3.9。

**官方资料:**
- 官方文档: [pillow.readthedocs.io/en/stable/](https://pillow.readthedocs.io/en/stable/)
- API 参考: [pillow.readthedocs.io/en/stable/reference/](https://pillow.readthedocs.io/en/stable/reference/)
- GitHub 仓库: [github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)
- PyPI 页面: [pypi.org/project/Pillow](https://pypi.org/project/Pillow/)

---

## 🧠 核心原则(内化成习惯)

1. **Image 对象是画布,操作不改原图——要 save 才落盘。** 打开图片得到的是内存里的画布,你裁剪、加滤镜、改大小,原文件一根毛都不动。只有调用 `.save()` 才把结果写到硬盘。批量处理时一定要把输出路径和输入路径**分开**,别把原图覆盖了。

2. **先查再改:用 `.size`、`.mode`、`.format` 摸清图片底细。** 不同图片可能是 RGB、RGBA(带透明通道)、灰度(L)模式。保存为 JPEG 前必须先把 RGBA 转成 RGB,否则直接报错——就像你不能把透明玻璃直接印到普通白纸上,得先铺个白色底。

3. **压缩用 `quality` 参数,不是乱猜的。** JPEG 的 `quality` 范围 1~95(不是 100!95 是上限有意义值),85 是肉眼和文件大小的黄金平衡点。WebP 格式压缩率更高,同等画质比 JPEG 小 25~35%。

4. **缩放用 `thumbnail` 保比例,用 `resize` 强制尺寸。** `thumbnail((800, 800))` 是"等比缩小到 800×800 以内不拉伸";`resize((800, 800))` 是"不管原始比例,强制变成 800×800"。搞混了图会变形。

5. **批量处理加 try-except,一张坏图别让整批失败。** 实际任务里总会有几张损坏文件或格式不对的图。把每张图的处理包在 `try/except` 里,记录失败的文件名继续跑,别让一个坏苹果毁了整筐。

---

## 🛠 操作要点

### 安装

```bash
pip install Pillow

# 验证安装
python -c "from PIL import Image; print(Image.__version__)"
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**

### 最小可运行示例

```python
from PIL import Image

# 打开图片
img = Image.open("photo.jpg")
print(f"尺寸: {img.size}, 模式: {img.mode}, 格式: {img.format}")

# 缩放(等比,长边不超过 800)
img.thumbnail((800, 800), Image.LANCZOS)

# 保存(quality=85 是 JPEG 的黄金参数)
img.save("output/photo_small.jpg", quality=85, optimize=True)
print("完成!")
```

### 四大常用操作

```python
from PIL import Image, ImageDraw, ImageFont
import os

# ── 操作 1:裁剪(crop)──
# crop 接受 (left, upper, right, lower) 四元组,坐标原点在左上角
def crop_center(img: Image.Image, size: tuple) -> Image.Image:
    """居中裁剪到指定正方形尺寸"""
    w, h = img.size
    target = min(w, h, size[0])
    left = (w - target) // 2
    top = (h - target) // 2
    return img.crop((left, top, left + target, top + target)).resize(size, Image.LANCZOS)

# ── 操作 2:加文字水印 ──
def add_text_watermark(img: Image.Image, text: str, opacity: int = 128) -> Image.Image:
    """右下角加半透明文字水印"""
    # 转 RGBA 以支持透明度
    img = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # 水印位置:右下角留 20px 边距
    w, h = img.size
    # 注意:没有指定字体时用默认字体,中文可能乱码,需传入 .ttf 字体路径
    draw.text((w - 150, h - 40), text, fill=(255, 255, 255, opacity))
    result = Image.alpha_composite(img, overlay)
    return result.convert("RGB")  # 转回 RGB 方便保存为 JPEG

# ── 操作 3:格式转换 ──
def convert_format(src: str, dst_format: str = "webp") -> str:
    """把图片转换为目标格式,返回新文件路径"""
    img = Image.open(src)
    if img.mode == "RGBA" and dst_format.lower() == "jpeg":
        img = img.convert("RGB")  # JPEG 不支持透明通道
    base = os.path.splitext(src)[0]
    dst = f"{base}.{dst_format}"
    img.save(dst, quality=85, optimize=True)
    return dst

# ── 操作 4:批量压缩一个目录 ──
def batch_compress(input_dir: str, output_dir: str,
                   max_side: int = 1200, quality: int = 85):
    """批量压缩目录内所有 JPEG/PNG,输出到 output_dir"""
    os.makedirs(output_dir, exist_ok=True)
    ok, fail = 0, []
    for fname in os.listdir(input_dir):
        if not fname.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        src = os.path.join(input_dir, fname)
        dst = os.path.join(output_dir, fname)
        try:
            with Image.open(src) as img:
                if img.mode == "RGBA":
                    img = img.convert("RGB")
                img.thumbnail((max_side, max_side), Image.LANCZOS)
                img.save(dst, quality=quality, optimize=True)
            ok += 1
        except Exception as e:
            fail.append((fname, str(e)))
    print(f"完成 {ok} 张,失败 {len(fail)} 张: {fail}")
```

### 常用操作速查表

| 想干嘛 | 代码 |
|--------|------|
| 打开图片 | `img = Image.open("a.jpg")` |
| 查看尺寸 | `img.size` → `(宽, 高)` |
| 等比缩小 | `img.thumbnail((800, 800), Image.LANCZOS)` |
| 强制缩放 | `img.resize((800, 800), Image.LANCZOS)` |
| 裁剪 | `img.crop((left, top, right, bottom))` |
| 旋转 | `img.rotate(90, expand=True)` |
| 水平翻转 | `img.transpose(Image.FLIP_LEFT_RIGHT)` |
| 转灰度 | `img.convert("L")` |
| 转 RGB | `img.convert("RGB")` |
| 保存 JPEG | `img.save("out.jpg", quality=85, optimize=True)` |
| 保存 WebP | `img.save("out.webp", quality=85)` |
| 获取像素值 | `img.getpixel((x, y))` |

### 中文水印注意事项

```python
# Pillow 默认字体不含中文,显示中文需要指定系统字体
# macOS:
font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", size=24)
# Ubuntu:
font = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-microhei.ttc", size=24)
# Windows:
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", size=24)

draw.text((x, y), "水印文字", font=font, fill=(255, 255, 255, 180))
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"电商图片批量处理"的完整方案。**

场景:主人有一批产品图(JPEG/PNG 混合),存放在 `images/` 目录,需要:① 统一裁成 800×800 居中正方形;② 右下角加"© 品牌名"文字水印;③ 压缩到 quality=85 并转为 JPEG;④ 输出到 `output/` 目录。

你需要完成:

1. **写出完整 Python 脚本**:
   - 遍历 `images/` 目录的所有 JPEG/PNG 文件
   - 居中裁剪到 800×800
   - 添加右下角文字水印
   - 保存为 JPEG(quality=85)到 `output/`
   - 支持 RGBA 图片(转 RGB 再保存)
   - 用 try/except 包住每张图,失败的记录到 `output/failed.txt`

2. **写出验收标准**:
   - `output/` 中每个 `.jpg` 的尺寸是 800×800(用 `Image.open().size` 验证)
   - 文件大小有所减小(压缩生效)
   - `failed.txt` 存在(即使为空),确认脚本跑完了全流程

3. **写出中文水印的字体配置方案**(三种系统各一条命令或路径)

4. **写出安全提示**:
   - 输出目录和输入目录要分开,绝对不要覆盖原图
   - **未经主人确认不得真装真跑**
   - 处理有版权的图片需确认授权

5. **沉淀技能卡**到 `agent-school/skills/pillow-image.md`。

> ⚠️ **安全边界**:这一课的毕业测验是**产出方案**,不是真跑。脚本的真实执行**必须先得到主人明确确认**。

---

## 🎓 过关标准

- [ ] 你写出了完整的批量处理脚本(裁剪+水印+压缩+格式转换)
- [ ] 你能解释 `thumbnail` 和 `resize` 的区别
- [ ] 你知道 RGBA 转 JPEG 前要先 `convert("RGB")`,以及为什么
- [ ] 你给出了三种系统下中文水印字体的配置方式
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/pillow-image.md`](../../skills/pillow-image.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T21 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 Pillow 批量处理图片

- **什么时候用**:批量裁剪、加水印、压缩、格式转换图片
- **来自**:T20 课 Pillow

## 步骤
1. 安装:pip install Pillow
2. 打开:img = Image.open(path)
3. 查底细:img.size / img.mode / img.format
4. RGBA→RGB 转换(保存 JPEG 前必须):img.convert("RGB")
5. 等比缩小:img.thumbnail((最大边, 最大边), Image.LANCZOS)
6. 居中裁剪:img.crop((left, top, right, bottom))
7. 加水印:ImageDraw.Draw(overlay).text(...)  + alpha_composite
8. 保存:img.save(dst, quality=85, optimize=True)
9. 批量时:try/except 包住每张,失败的记录到日志

## 验证
- Image.open(output).size 等于目标尺寸
- 输出文件大小小于原文件(压缩生效)

## 注意
- 输出目录和输入目录要分开,不覆盖原图
- 中文水印需指定系统 .ttf 字体文件路径
- JPEG quality 上限有意义值是 95(不是 100)
- WebP 比 JPEG 更省空间,现代浏览器均支持
```
