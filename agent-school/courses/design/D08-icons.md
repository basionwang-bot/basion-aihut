# 第 D08 课 · 图标用对,质感翻倍

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、D07(shadcn/ui) ｜ 难度:★★ ｜ 源头:[lucide-icons/lucide](https://github.com/lucide-icons/lucide)（23.0k ⭐）/ [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)（23.6k ⭐）

---

## 📖 你要学会什么

想象两个店铺招牌:一个用的是七拼八凑的图标——有的粗、有的细、有的是像素风、有的是描边风,放在一起像素材市场的展示区;另一个全程用同一套图标,线条粗细一致、风格统一,看一眼就觉得"这家店有品位"。**图标是界面设计里最容易被忽视、又最能拉开质感差距的细节。**

这门课教你用两套顶级开源图标库:
- **Lucide**:1600+ 个 SVG 图标,线条清爽,React/Vue/Svelte 全框架支持,一行导入即用
- **Heroicons**:Tailwind CSS 官方出品,分 outline/solid 两套风格,和 Tailwind 配合天衣无缝

两套库都是 MIT 开源、国内直接可用、无需 API key、不需要翻墙。

学完这一课,你能:
- 判断什么场景用 outline 图标、什么场景用 solid 图标
- 在 React 项目里安装并使用 Lucide 和 Heroicons
- 统一替换页面里五花八门的图标,换成风格一致的 SVG 图标集
- 用 className 给图标定制颜色和大小,完全融入 Tailwind 布局

**官方资料:**
- Lucide 仓库:[github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)
- Lucide 图标浏览器:[lucide.dev/icons](https://lucide.dev/icons)
- Heroicons 仓库:[github.com/tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)
- Heroicons 图标浏览器:[heroicons.com](https://heroicons.com)

---

## 🧠 核心原则

1. **图标风格统一是第一优先级。** 一个页面里混用描边图标和填充图标,视觉上会产生噪音。确定用哪套库,就全程用它——别混搭。

2. **Lucide vs Heroicons:怎么选?**
   - 用了 **shadcn/ui**?直接选 Lucide——shadcn 默认就集成 Lucide,组件里用的也是 Lucide 图标
   - 在 **Tailwind-heavy** 的项目里?选 Heroicons——Tailwind 官方出品,设计语言完全贴合
   - 两套都支持 React,安装方法类似,图标数量上 Lucide 更丰富

3. **outline 还是 solid?有讲究。**
   - **Outline(描边)**:轻盈、辅助、信息展示——适合导航栏、标签、说明文字旁的小图标
   - **Solid(填充)**:强调、行动、状态激活——适合被点击的图标、重要的状态图标
   - 一套 UI 里通常以 outline 为主,选中/激活状态切换成 solid

4. **图标大小和文字用 `size` 或 `className` 控制,不要写内联样式。** 用 `className="size-5"` 这样的 Tailwind 类,和文字的行高自然对齐。

5. **SVG 图标不需要字体文件,不需要 CDN,不会有字体图标的渲染问题。** 直接打包进你的 JavaScript,干净、可靠。

---

## 🛠 操作要点

### Lucide React 安装与使用

```bash
# 安装(先征得主人确认)
npm install lucide-react
```

**基础用法:**

```tsx
import { Heart, Search, User, Settings, ArrowRight } from 'lucide-react'

export default function NavBar() {
  return (
    <nav className="flex items-center gap-4">
      <Search className="size-5 text-gray-500" />
      <User className="size-5 text-gray-500" />
      <Settings className="size-5 text-gray-500" />
    </nav>
  )
}
```

**自定义大小和颜色:**

```tsx
// 方式一:用 className(推荐,Tailwind 风格)
<Heart className="size-8 text-red-500" />

// 方式二:用 size 和 color prop
<Heart size={32} color="#ef4444" />

// 调整线条粗细
<Heart strokeWidth={1.5} className="size-6" />
```

**在 shadcn/ui 组件里用 Lucide(shadcn 已内置,直接用):**

```tsx
import { Button } from "@/components/ui/button"
import { Download, Plus, Trash2 } from "lucide-react"

<Button>
  <Plus className="mr-2 size-4" />
  新建
</Button>

<Button variant="destructive">
  <Trash2 className="mr-2 size-4" />
  删除
</Button>
```

### Heroicons React 安装与使用

```bash
# 安装(先征得主人确认)
npm install @heroicons/react
```

**Heroicons 有 4 种尺寸/风格的包路径:**

| 包路径 | 说明 | 适合场景 |
|--------|------|----------|
| `@heroicons/react/24/outline` | 24px 描边版 | 导航、标签、信息辅助 |
| `@heroicons/react/24/solid` | 24px 填充版 | 激活状态、强调动作 |
| `@heroicons/react/20/solid` | 20px 填充版 | 较小的 UI 元素 |
| `@heroicons/react/16/solid` | 16px 填充版 | 行内文字旁的极小图标 |

**基础用法:**

```tsx
import { BeakerIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid'

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-2">
      {/* 普通状态:outline */}
      <HomeIcon className="size-6 text-gray-400" />
      {/* 选中状态:solid */}
      <HomeIconSolid className="size-6 text-blue-600" />
    </aside>
  )
}
```

> **注意命名规范:** Heroicons 所有图标名都以 `Icon` 结尾,比如 `HomeIcon`、`UserIcon`、`BeakerIcon`。

### 查找图标名的最佳方式

- **Lucide:**访问 [lucide.dev/icons](https://lucide.dev/icons) → 搜索关键词 → 点击图标 → 复制 React 组件名
- **Heroicons:**访问 [heroicons.com](https://heroicons.com) → 搜索 → 选 outline/solid → 点击复制

> 🇨🇳 **中国用户提示:** 上述两个网站都可以国内直接访问。npm 安装国内网络通常可用,若遇慢可配置镜像: `npm config set registry https://registry.npmmirror.com`

### 统一替换图标(真实任务思路)

假设主人页面里有一批旧图标(emoji、乱七八糟的 png)要统一换掉:

1. **先摸清现状**:找出页面里所有用图标的地方(`grep -r "icon\|Icon\|emoji" src/`)
2. **选定图标库**:shadcn 项目选 Lucide,纯 Tailwind 项目选 Heroicons
3. **建立映射表**:旧图标 → 新图标名
4. **逐页替换**:按文件逐一替换,先跑测试或截图对比
5. **统一样式**:所有图标用同一个 `className` 基准(`size-5 text-current`)

---

## 📝 毕业测验(必须真做,交证据)

**任务:给一个页面统一换上风格一致的 SVG 图标。**

**阶段一:选库与安装**

1. 根据主人的项目情况选择图标库(有 shadcn 选 Lucide,Tailwind-only 选 Heroicons)。**征得主人确认后**执行安装命令,截图安装成功的输出。

2. 写出你选择这个库的理由(2-3 句,说清楚为什么)。

**阶段二:替换图标**

3. 找到主人页面里**至少有 5 处**图标使用的地方(可以是 emoji、png 图标、或 Font Awesome 类名)。

4. 对每处图标:
   - 说明原来用的是什么
   - 去图标网站找到对应的新图标名
   - 写出替换后的代码

5. 完成替换后截图页面效果,证明所有图标已统一风格。

**阶段三:展示技巧**

6. 实现一组"outline ↔ solid 切换"的效果:比如导航菜单里,未选中用 outline 图标,选中后换成 solid 版本。截图或录屏展示效果。

7. 展示一个图标 + 文字对齐的例子:图标和旁边的文字垂直居中对齐,不偏不倚。

**阶段四:沉淀技能卡**

8. 把"Lucide 安装与常用写法 + Heroicons 安装与包路径规则 + outline vs solid 选择建议"沉淀成 `skills/icons.md`。

> ⚠️ **安全边界:**
> - `npm install lucide-react` / `npm install @heroicons/react` ——**安装前先征得主人确认**
> - 不要改动项目里已有的图标配置文件(如 `iconfont.js`),只是添加新的图标库

---

## 🎓 过关标准

- [ ] 你能说出 Lucide 和 Heroicons 各自的特点,以及什么时候选哪个
- [ ] 你能说出 outline 和 solid 图标的区别和适用场景
- [ ] 你成功安装了图标库(截图证明)
- [ ] 你把页面里至少 5 处图标替换成了同一套 SVG 图标(截图对比)
- [ ] 你实现了 outline ↔ solid 状态切换的效果
- [ ] 你写出了图标 + 文字垂直居中对齐的代码
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
