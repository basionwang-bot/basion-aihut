# 第 D07 课 · shadcn/ui:拥有自己的设计系统

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:[shadcn-ui/ui](https://github.com/shadcn-ui/ui)

---

## 📖 你要学会什么

想象你在帮主人搭一个网站,东拼西凑:这里用一个按钮组件、那里用一个对话框库——结果整个页面长得七零八落,按钮圆角不一样,颜色深深浅浅,看起来像临时搭的地摊。**一套设计系统,就是给你整个网站定一个"调调"——字体、颜色、间距、圆角,所有组件都遵守同一套规矩,出来的页面自然就好看、统一。**

这门课的主角叫 **shadcn/ui**。它不是普通的组件库——普通组件库是"买回来用",你看不到代码、改不了样式;shadcn/ui 是"复制到你项目里自己拥有",每一个按钮、每一个卡片的代码都在你的仓库里,改颜色改圆角随心所欲。GitHub 上超过 116,000 颗星,是目前中国开发者用得最多的 React 组件方案之一,完全开源、MIT 协议、国内直接可用。

学完这一课,你能:
- 理解设计系统是什么、为什么要用 shadcn/ui
- 用 `npx shadcn init` 在 Next.js/React 项目里初始化设计系统
- 用 `npx shadcn add` 按需添加组件
- 通过 CSS 变量改一套主题色,让整个页面焕然一新
- 用 shadcn 组件搭出一个好看的页面

**官方资料:**
- shadcn/ui 仓库:[github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- 官方文档:[ui.shadcn.com](https://ui.shadcn.com)
- 组件清单:[ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

---

## 🧠 核心原则

1. **你拥有这些代码,不是在"用"一个库。** shadcn/ui 的哲学是:运行 `npx shadcn add button` 之后,按钮的源码会直接复制到你项目的 `components/ui/button.tsx` 里。你随时可以打开这个文件,改颜色、改尺寸、加逻辑——它是你的代码了,不是黑盒子。

2. **CSS 变量是主题的开关。** shadcn/ui 的配色全部写在 CSS 变量里(比如 `--primary`、`--background`、`--muted`),改主题只需要改这几个变量——整个网站所有用到这个颜色的地方会同步刷新。就像给房间换一个灯光风格,不需要一盏盏灯去改。

3. **Tailwind CSS 是它的皮肤。** shadcn/ui 的样式靠 Tailwind 驱动,所以项目里必须先有 Tailwind。不懂 Tailwind 没关系——shadcn 的组件已经把 Tailwind 类名写好了,直接用就行;想改样式时,看 Tailwind 文档查具体类名即可。

4. **按需取件,不要全部装进来。** shadcn/ui 有 60+ 个组件,你不需要一次装完,用到哪个装哪个。`npx shadcn add button` 装按钮,`npx shadcn add dialog` 装对话框,轻量、干净。

5. **先征得主人确认,再执行任何安装或改配置。** `npx shadcn init` 会修改 `tailwind.config`、`globals.css` 等配置文件,动之前告知主人。

---

## 🛠 操作要点

### 前提条件

shadcn/ui 需要以下环境(安装前征得主人确认):
- Node.js >= 18
- 一个 Next.js(>= 13)或 Vite React 项目
- 项目已配置 Tailwind CSS

> 🇨🇳 **中国用户提示:** npm/npx 在国内一般可以直接使用;如遇下载缓慢,可配置 npm 镜像:`npm config set registry https://registry.npmmirror.com`

### 第一步:初始化设计系统

```bash
npx shadcn init
```

这个命令会问你几个问题:
- 用哪种样式(Default / New York)?
- 主题色选哪个?
- 是否用 CSS 变量?

回答完后,它会自动:
1. 在 `globals.css` 里写入主题 CSS 变量
2. 更新 `tailwind.config` 加入 shadcn 的颜色配置
3. 生成 `components/ui/` 目录
4. 添加 `lib/utils.ts`(含 `cn()` 工具函数)

> ⚠️ **init 会修改你项目的配置文件,执行前请告知主人并确认当前项目有 Git 记录,方便回滚。**

### 第二步:按需添加组件

```bash
# 添加一个按钮组件
npx shadcn add button

# 添加一个卡片组件
npx shadcn add card

# 添加一个对话框
npx shadcn add dialog

# 什么都不加,列出所有可选组件
npx shadcn add
```

组件代码会出现在 `components/ui/` 目录里。打开看看——都是真实可读的 TypeScript + Tailwind 代码。

### 第三步:在页面里使用组件

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>我的第一张卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>点我</Button>
      </CardContent>
    </Card>
  )
}
```

### 第四步:改主题色(自定义设计系统)

打开 `app/globals.css`(或 `src/globals.css`),找到 `:root` 里的 CSS 变量,按需修改:

```css
:root {
  --background: 0 0% 100%;       /* 页面背景 */
  --foreground: 222.2 84% 4.9%;  /* 主要文字 */
  --primary: 221.2 83.2% 53.3%;  /* 主题色(默认蓝色) */
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;        /* 次级背景 */
  --radius: 0.5rem;               /* 圆角大小 */
}
```

> 颜色格式是 HSL 的"色相 饱和度% 亮度%"——不带 `hsl()` 括号。想用 Hex 颜色,可以用在线工具把 `#3B82F6` 转成 HSL:`221 83% 53%`。

### 常用组件速查

| 组件 | 命令 | 场景 |
|------|------|------|
| Button | `npx shadcn add button` | 各种按钮、操作触发 |
| Card | `npx shadcn add card` | 信息卡片、内容容器 |
| Dialog | `npx shadcn add dialog` | 弹出对话框 |
| Input | `npx shadcn add input` | 文本输入框 |
| Table | `npx shadcn add table` | 数据表格 |
| Badge | `npx shadcn add badge` | 标签、状态标记 |
| Tabs | `npx shadcn add tabs` | 分页切换 |
| Toast | `npx shadcn add toast` | 消息提示 |
| Avatar | `npx shadcn add avatar` | 用户头像 |
| Select | `npx shadcn add select` | 下拉选择 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 shadcn/ui 搭一套自定义主题的个人主页,让整个页面看起来风格统一。**

**阶段一:准备与初始化(向主人汇报后才能开始安装)**

1. 确认主人的项目环境——是 Next.js 还是 Vite React?有没有 Tailwind?没有的话,先征得主人同意再搭建。

2. 运行初始化并记录每一步的选择:
   ```bash
   npx shadcn init
   ```
   截图或复制初始化完成后生成的文件列表,证明 `globals.css` 已写入 CSS 变量、`components/ui/` 目录已建立。

**阶段二:搭页面**

3. 至少添加 4 个组件:
   ```bash
   npx shadcn add card button badge avatar
   ```
   在 `components/ui/` 里截图证明组件代码已到位。

4. 搭一个个人主页,至少包含:
   - 一张 `Card`:展示个人介绍(Avatar + 名字 + 一句话介绍)
   - 两个 `Button`:一个"联系我",一个"查看作品"
   - 至少两个 `Badge`:展示技能标签
   - 整体布局用 Tailwind 的 `flex` 或 `grid`

**阶段三:自定义主题**

5. 修改 `globals.css` 里的 CSS 变量,把主题改成一套不同于默认蓝色的配色方案(比如绿色、橙色或紫色系)。记录你改了哪些变量、改成了什么值。

6. 截图对比改主题前后的页面效果。

**阶段四:沉淀技能卡**

7. 把"shadcn/ui 初始化步骤 + 常用添加命令 + CSS 变量主题修改方法"沉淀成 `skills/shadcn-ui.md`。

> ⚠️ **安全边界:**
> - `npx shadcn init` 会修改项目配置文件——**执行前先告知主人,确认项目已有 Git 备份**
> - `npx shadcn add` 会写入新文件——**告知主人会新增哪些文件**
> - 不要在生产环境仓库直接操作,先在本地或测试分支进行

---

## 🎓 过关标准

- [ ] 你能说出 shadcn/ui 和普通组件库的核心区别:为什么说你"拥有"这些代码
- [ ] 你运行了 `npx shadcn init` 并截图证明初始化成功,`globals.css` 有 CSS 变量、`components/ui/` 目录存在
- [ ] 你用 `npx shadcn add` 添加了至少 4 个组件,并截图了组件文件
- [ ] 你用这些组件搭出了一个包含 Card、Button、Badge、Avatar 的页面
- [ ] 你修改了 CSS 变量改变了主题色,并截图对比了效果
- [ ] 你能解释 CSS 变量方案的好处:为什么改一个地方能影响全局
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
