# 第 T26 课 · exiftool 读写文件元数据

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:exiftool 官方文档 · [exiftool.org](https://exiftool.org/) · [exiftool.org/faq.html](https://exiftool.org/faq.html) · [github.com/exiftool/exiftool](https://github.com/exiftool/exiftool)

---

## 📖 你要学会什么

学完这一课,你能读取一张照片里隐藏的所有秘密——拍摄时间、手机型号、**GPS 精确坐标**——也能在发图之前把这些信息统统抹掉,保护隐私。

想象每张照片就是一封信。信封里除了你看到的那张图,还夹着一张**小纸条**——上面密密麻麻写着:这张照片是什么时间拍的、用哪台手机、光圈快门是多少、**当时你在哪个小区的哪栋楼旁边**。这张小纸条叫做"元数据"(metadata),普通人看不见,但会读文件格式的程序一眼就能读出来。

exiftool 就是**专门读写、清除这张小纸条的工具**。不论是照片(JPEG、PNG、RAW)、视频(MP4、MOV)还是 PDF,它都能翻开来读,改完再封回去。隐私场景下,发图前先跑一条命令把 GPS 信息抹掉,是个好习惯。

exiftool 由 Phil Harvey 开发,用 Perl 写成,是元数据处理领域最权威的开源工具,支持 200+ 种文件格式。

**官方资料:**
- 官方主页: [exiftool.org](https://exiftool.org/)
- 安装说明: [exiftool.org/install.html](https://exiftool.org/install.html)
- 常见问题: [exiftool.org/faq.html](https://exiftool.org/faq.html)
- GitHub 仓库: [github.com/exiftool/exiftool](https://github.com/exiftool/exiftool)

---

## 🧠 核心原则

1. **读不改文件,写才改。** 单纯 `exiftool 照片.jpg` 只读出信息,不动原文件。加了 `-TagName=值` 或 `-all=` 才是写操作。**写之前先读,心里有底再改。**

2. **exiftool 默认备份原文件。** 写操作执行后,它会自动把原文件重命名为 `照片.jpg_original`。这是个保险机制——如果改坏了,原件还在。确认没问题再手动删备份。

3. **"清除所有元数据"不等于"删除内容"。** `-all=` 命令只抹掉元数据标签,图片本身的像素、视频的画面都不受影响,放心用。

4. **GPS 信息是最敏感的。** 用手机拍的照片几乎都带 GPS 坐标(精度有时能到米级)。发到社交媒体前先用 `-GPS*=` 专门清掉 GPS 信息,是最小化原则的体现——只删敏感的,保留其他有用的拍摄参数。

5. **批量操作时先 `-n`(不写)验演,再真改。** 实际上 exiftool 没有内置 dry-run 标志,但你可以先用纯读命令验证"哪些文件会被影响",确认范围对了再执行写命令。

---

## 🛠 操作要点

### 安装

> ⚠️ **安装须知:以下命令涉及系统软件安装,未经主人确认不得真装真跑,只先给方案。**

```bash
# macOS(Homebrew)
brew install exiftool

# Linux(Debian/Ubuntu)
sudo apt install libimage-exiftool-perl

# Windows(Chocolatey)
choco install exiftool

# 也可在官网下载独立可执行包:https://exiftool.org/install.html
# Windows 用户下载 exiftool(-k).exe 改名 exiftool.exe 放到 PATH 里即可
```

> 🇨🇳 **中国用户提示:** `apt` 和 `brew` 均可国内直接安装。也可从 [exiftool.org](https://exiftool.org/) 下载 .tar.gz 手动安装,官网服务器在境外但文件很小(<5MB),一般不需要特殊网络。

### 最小可运行示例(读操作,不改文件)

**查看一张图片的所有元数据:**
```bash
exiftool 照片.jpg
# 输出很长,包括 Make、Model、GPS、DateTime 等几十个字段
```

**只看 GPS 相关字段:**
```bash
exiftool -GPS* 照片.jpg
# 示例输出:
# GPS Latitude  : 39 deg 54' 27.60" N
# GPS Longitude : 116 deg 23' 17.40" E
# GPS Altitude  : 50 m Above Sea Level
```

**只看几个关键字段:**
```bash
exiftool -Make -Model -DateTimeOriginal -ImageSize 照片.jpg
# 示例输出:
# Make              : Apple
# Model             : iPhone 15 Pro
# Date/Time Original: 2026:05:20 14:33:01
# Image Size        : 4032x3024
```

### 写操作:清除隐私元数据

**清除所有 GPS 信息(发图前必备操作):**
```bash
# 只删 GPS 字段,其他保留
exiftool -GPS*= 照片.jpg
# 会生成 照片.jpg_original(原件备份)
# 确认没问题后删备份:
rm 照片.jpg_original
```

**核弹选项:清除全部元数据:**
```bash
exiftool -all= 照片.jpg
# 所有标签全部清空,只剩像素数据
```

**批量清除一个文件夹下所有 jpg 的 GPS:**
```bash
exiftool -GPS*= /path/to/photos/*.jpg
# 每个文件都会生成 _original 备份
```

**修改/伪造字段(比如把拍摄时间改成另一个):**
```bash
exiftool -DateTimeOriginal="2026:01:01 00:00:00" 照片.jpg
```

### 常用命令速查

| 想干嘛 | 命令 |
|--------|------|
| 读所有元数据 | `exiftool file.jpg` |
| 只读 GPS 信息 | `exiftool -GPS* file.jpg` |
| 只读某几个字段 | `exiftool -Make -Model file.jpg` |
| 清除 GPS 信息 | `exiftool -GPS*= file.jpg` |
| 清除全部元数据 | `exiftool -all= file.jpg` |
| 清除后删备份 | `rm file.jpg_original` |
| 修改某个字段 | `exiftool -Author="张三" file.jpg` |
| 批量处理文件夹 | `exiftool -GPS*= /path/to/dir/` |
| 输出为 JSON | `exiftool -json file.jpg` |
| 不生成备份 | `exiftool -overwrite_original -GPS*= file.jpg` |
| 查看支持的格式 | `exiftool -ver` |

### 隐私自查清单(发图前走一遍)

```bash
# 先读,看看有没有敏感信息
exiftool -GPS* -Make -Model -SerialNumber 照片.jpg

# 如果有 GPS → 清除
exiftool -GPS*= 照片.jpg

# 如果有序列号(某些相机有) → 视情况清除
exiftool -SerialNumber= 照片.jpg

# 验证清除结果
exiftool -GPS* 照片.jpg
# 期望输出:空(没有任何 GPS 字段了)
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:对一张照片完成"读取元数据 → 清除 GPS → 验证清除结果"的完整隐私保护流程。**

如果手边没有带 GPS 的照片,可以用以下方式生成一个内嵌元数据的测试文件:

```bash
# 方案 A:如果系统有 exiftool 且有任意 JPEG,直接用
# 方案 B:用 exiftool 写入假 GPS 数据到一个空文件(需要已安装 exiftool)
# 先找一张任意 jpg(哪怕是系统自带的)
cp /usr/share/pixmaps/debian-logo.png /tmp/test_photo.png 2>/dev/null || \
  curl -s -o /tmp/test_photo.jpg "https://httpbin.org/image/jpeg"

# 写入假 GPS(模拟北京天安门坐标)
exiftool -GPSLatitude=39.9087 -GPSLatitudeRef=N \
          -GPSLongitude=116.3975 -GPSLongitudeRef=E \
          /tmp/test_photo.jpg
```

完成以下 3 个任务并附上真实命令 + 输出:

**任务一:读取元数据,确认 GPS 存在**
```bash
exiftool -GPS* /tmp/test_photo.jpg
# 期望输出:显示 GPSLatitude 和 GPSLongitude 字段
```

**任务二:清除 GPS 信息**
```bash
exiftool -GPS*= /tmp/test_photo.jpg
# 期望输出:1 image files updated
```

**任务三:验证 GPS 已清除**
```bash
exiftool -GPS* /tmp/test_photo.jpg
# 期望输出:空(没有任何输出),说明 GPS 信息已彻底清除
```

**验证标准:**
- 任务一输出至少包含 `GPS Latitude` 和 `GPS Longitude` 字段
- 任务二输出 `1 image files updated`
- 任务三输出为空(无 GPS 字段)
- 同目录下生成了 `_original` 备份文件

**沉淀技能卡:** 把隐私自查清单 + 常用命令速查沉淀成 `skills/exiftool.md`。

> ⚠️ **安全边界:** exiftool 只操作本地文件,不联网,非常安全。但注意:**写操作会修改文件**,exiftool 虽然自动备份,但清除元数据的操作本质上是不可逆的(除非备份还在)。**批量操作前务必先确认文件范围,或先读操作验证后再写**。安装须先征得主人确认。

---

## 🎓 过关标准

- [ ] 你能读出一张图片的 GPS 信息(或证明它没有 GPS)
- [ ] 你用 `-GPS*=` 成功清除了 GPS 字段,附上了"1 image files updated"的真实输出
- [ ] 你验证了清除后 GPS 字段为空
- [ ] 你能说清楚 `_original` 备份文件的用途
- [ ] 你知道 `-overwrite_original` 的意义和风险
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T27 课。
