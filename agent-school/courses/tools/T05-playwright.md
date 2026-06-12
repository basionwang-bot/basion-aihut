# 第 T05 课 · Playwright 浏览器操作

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:Playwright 官方文档 · microsoft/playwright-python

---

## 📖 你要学会什么

学完这一课,你会用 Playwright 像人一样操作浏览器——打开网页、点按钮、填表单、截图留证、抓取渲染后的内容——而不是只能对着静态 HTML 干瞪眼。

想象这样一个场景:你想去一家餐厅看菜单,但菜单不是印在纸上的,而是服务员站在你面前用平板给你演示——每次你点"下一页"才显示下一屏。这种动态内容,靠传统爬虫(只能读纸质菜单)是抓不到的。Playwright 干的事就是:**帮你开一个真正的浏览器,像人一样坐在那里翻页、点击、截图**,把你要的东西拿回来。

Playwright 是微软开源的浏览器自动化框架,支持 Python、JavaScript、Java 等语言,能驱动 Chromium、Firefox、WebKit 三种浏览器。最新版本于 2026 年 5 月更新,Python 版要求 Python ≥ 3.9。

**官方资料:**
- 官方文档: [playwright.dev/python/docs/intro](https://playwright.dev/python/docs/intro)
- PyPI 页面: [pypi.org/project/playwright](https://pypi.org/project/playwright/)
- GitHub 仓库: [github.com/microsoft/playwright-python](https://github.com/microsoft/playwright-python)

---

## 🧠 核心原则(内化成习惯)

1. **先问"静态还是动态"。** 如果目标网页的内容是 JavaScript 渲染出来的(你看网页源码只有一个空壳),就轮到 Playwright 上场;如果是纯静态 HTML,用 BeautifulSoup(T08 课)就够了,别大炮打蚊子。

2. **操作前先定位,定位要稳。** 点按钮之前先找到那个按钮——用文本内容、CSS 选择器、aria 属性定位,比用位置坐标更可靠。网页改版了,坐标会变,文字通常不变。

3. **等待是必须的,别假设"页面已加载"。** 浏览器加载是异步的。点了"搜索"之后,结果可能 500 毫秒后才出现。Playwright 有内建等待机制(`wait_for_selector`、`wait_for_load_state`),用它,别用 `time.sleep` 蒙。

4. **截图是你的证据。** 每次关键操作后截一张图,既是给主人看的证据,也是你自己调试时的线索。`page.screenshot(path="...")`——一行搞定。

5. **无头模式(headless)节省资源,有头模式(headed)方便调试。** 正式跑用无头模式;调试不知道哪里出问题时,改成 `headless=False`,亲眼看着浏览器操作,问题一目了然。

---

## 🛠 操作要点

### 安装(两步,缺一不可)

```bash
# 第一步:装 Python 库
pip install playwright

# 第二步:装浏览器驱动(下载 Chromium / Firefox / WebKit 三套二进制)
playwright install
```

> ⚠️ 两步都要跑。只装了 Python 库但没装浏览器驱动,运行时会直接报错说找不到可执行文件。

### 一个最小可运行脚本(同步版)

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器(headless=True 不弹窗,False 弹出可见窗口)
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. 打开网页
    page.goto("https://example.com")

    # 2. 等待页面加载完成
    page.wait_for_load_state("networkidle")

    # 3. 提取标题
    title = page.title()
    print(f"页面标题: {title}")

    # 4. 截图留证
    page.screenshot(path="screenshot.png")

    browser.close()
```

### 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 打开网页 | `page.goto("https://...")` |
| 点击元素 | `page.click("text=登录")` 或 `page.click("#submit-btn")` |
| 填写输入框 | `page.fill("input[name='q']", "搜索词")` |
| 按回车 | `page.keyboard.press("Enter")` |
| 等待元素出现 | `page.wait_for_selector(".result-list")` |
| 抓取文本 | `page.inner_text(".article-title")` |
| 截图 | `page.screenshot(path="out.png")` |
| 获取完整 HTML | `page.content()` |

### 定位元素的优先顺序

1. 文本内容: `page.click("text=立即购买")`
2. aria 标签: `page.click("[aria-label='搜索']")`
3. CSS 选择器: `page.click(".btn-primary")`
4. 最后才考虑 XPath(脆弱,不到万不得已别用)

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个用 Playwright 完成真实小任务的完整方案。**

选定任务:打开公开网页 `https://example.com` → 截图 → 提取页面标题和正文文字 → 把结果保存到文件。

你需要做到:

1. **写出完整可运行的 Python 脚本**,包含:
   - 安装步骤注释
   - 打开网页
   - 等待加载
   - 截图(输出到 `output/screenshot.png`)
   - 提取标题 + 正文第一段文字
   - 把结果写入 `output/result.txt`
   - 关闭浏览器

2. **写出"怎么验证成功"的标准**:
   - `output/screenshot.png` 存在且非空
   - `output/result.txt` 里有非空的标题字符串
   - 脚本退出码为 0(无异常)

3. **写出环境说明**:需要什么 Python 版本、需要提前安装什么、在什么操作系统下测试过。

4. **写出安全提示**:
   - 如果要爬的不是 `example.com` 而是主人指定的某个真实网站,需要先确认:该网站 robots.txt 是否允许爬取、是否需要登录账号(登录账号绝对要先问主人)。
   - 脚本写好后,**真正安装并运行前必须先征得主人确认**。

5. **把以上内容整理成报告卡**,写进你宿舍的文件(如 `agent-school/skills/playwright-plan.md`)。

6. **沉淀技能卡**:把 Playwright 的核心用法、定位优先顺序、等待策略沉淀成 `skills/playwright-browser.md`。

> ⚠️ **安全边界(守住这条线)**: 这一课的毕业测验是**产出方案**,不是真跑。`pip install playwright` 和 `playwright install` 这两条命令,以及脚本的真实执行——**必须先得到主人明确确认,再执行**。如果主人当场在场、已经拍板"你去装吧",那才能动手;否则只交方案,不自行安装运行。

---

## 🎓 过关标准

- [ ] 你写出了一个**完整可运行的 Playwright 脚本**(包含打开、等待、截图、提取、保存)
- [ ] 你写清楚了**成功验证标准**(不是"感觉应该行",是具体的可核查条件)
- [ ] 你写出了**环境要求**和**安全提示**(robots.txt、账号、主人确认)
- [ ] 你理解了"静态页 vs 动态页"的判断逻辑,能说清楚什么时候用 Playwright、什么时候不用
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T06 课。
