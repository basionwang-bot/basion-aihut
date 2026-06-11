# 第 T32 课 · Prettier + ESLint 自动格式化与查错

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 + T01(gh-cli)、T02(git-advanced) ｜ 难度:★★☆ ｜ 源头:Prettier 官方文档 · [prettier.io/docs/](https://prettier.io/docs/) · ESLint 官方文档 · [eslint.org/docs/latest/](https://eslint.org/docs/latest/)

---

## 📖 你要学会什么

学完这一课,你能用 Prettier 和 ESLint 自动整理 JavaScript/TypeScript 项目的代码风格、发现潜在问题——像一个不知疲倦的"代码审美官+质检员"坐在你旁边,每次你写完代码都帮你梳妆打扮一遍,还顺手把明显的 bug 苗子揪出来。

想象一个 10 人小组一起写代码:有人用 2 格缩进,有人用 4 格;有人单引号,有人双引号;有人行末加分号,有人不加。合并代码时差异到处都是,review 时一半精力花在"为啥换行"上,正事都没法专心看。这就是没有"格式统一器"的团队的日常。

**Prettier** 干的是**强制美容**——它不和你商量,直接按照统一规范重新排版你的代码,争议归零。**ESLint** 干的是**找潜在问题**——比如用了但没声明的变量、永远不会执行的代码、不安全的写法。两者配合:Prettier 管"好不好看",ESLint 管"对不对"。

**官方资料:**
- Prettier 文档: [prettier.io/docs/](https://prettier.io/docs/)
- Prettier 配置选项: [prettier.io/docs/options](https://prettier.io/docs/options)
- ESLint 文档: [eslint.org/docs/latest/](https://eslint.org/docs/latest/)
- ESLint 规则列表: [eslint.org/docs/latest/rules/](https://eslint.org/docs/latest/rules/)
- eslint-config-prettier(避免两者冲突): [github.com/prettier/eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

---

## 🧠 核心原则

1. **Prettier 管排版,ESLint 管逻辑——两个不同的人。** 别让它们打架。默认状态下,ESLint 也有格式相关的规则(缩进、引号、分号)——这会和 Prettier 冲突。解决方案是装 `eslint-config-prettier`,把 ESLint 里所有与 Prettier 重叠的格式规则关掉,两人各司其职。

2. **配置文件是合同,团队一起签。** `.prettierrc` 和 `eslint.config.js` 这两个文件要提交进 git 仓库——这样所有人、所有 CI 机器都用同一套规则,不存在"我本地没问题,CI 报错"。

3. **先跑 Prettier,再跑 ESLint。** 顺序很重要:先让 Prettier 格式化,再让 ESLint 检查逻辑问题。反过来可能产生冲突。

4. **`--check` 模式和 `--write` 模式是两回事。** `--check` 只告诉你"有问题",不动文件,适合 CI 检查;`--write` 会直接改文件,适合本地修复。**在不熟悉的仓库里跑 `--write` 前必须先问主人**——它会直接改文件。

5. **不是所有文件都该格式化。** 用 `.prettierignore` 排除自动生成的文件(比如 `dist/`、`build/`、`.next/`)——这些文件是构建产物,改了没有意义,还会产生大量无用的 git diff。

---

## 🛠 操作要点

### 安装

```bash
# 在项目目录里安装(推荐本地安装,不全局安装,避免版本冲突)
npm install --save-dev prettier eslint

# 同时装上让两者不冲突的桥接包
npm install --save-dev eslint-config-prettier

# 如果是 TypeScript 项目,还需要:
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

> ⚠️ **安装前先问主人。** `npm install` 会修改 `package.json` 和 `node_modules/`,是项目层面的变更。

### Prettier 配置文件(`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

说人话翻译:
- `semi: true` → 行末加分号
- `singleQuote: true` → 用单引号
- `printWidth: 100` → 超过 100 个字符才换行
- `tabWidth: 2` → 2 格缩进
- `trailingComma: "es5"` → 对象/数组最后一项加逗号(方便 git diff 更干净)

### ESLint 配置文件(`eslint.config.js`,ESLint v9 扁平化配置格式)

```javascript
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,  // ESLint 推荐规则
  prettierConfig,           // 关掉和 Prettier 冲突的格式规则
  {
    rules: {
      'no-unused-vars': 'warn',     // 声明了但没用的变量:警告
      'no-console': 'warn',         // 别在生产代码里留 console.log:警告
      'eqeqeq': 'error',            // 必须用 === 而不是 ==:报错
    }
  }
];
```

### .prettierignore 示例

```
# .prettierignore
node_modules/
dist/
build/
.next/
*.min.js
package-lock.json
```

### 常用命令速查

```bash
# Prettier:检查哪些文件格式不符合规范(不改文件)
npx prettier --check "src/**/*.{js,ts,tsx}"

# Prettier:直接格式化并覆盖文件(改之前先问主人!)
npx prettier --write "src/**/*.{js,ts,tsx}"

# ESLint:检查问题(不改文件)
npx eslint "src/**/*.{js,ts}"

# ESLint:自动修复可自动修复的问题(会改文件!)
npx eslint --fix "src/**/*.{js,ts}"

# 一键检查整个项目(推荐写进 package.json scripts)
npx prettier --check . && npx eslint .
```

### 加进 `package.json` 的 scripts 段

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "check": "prettier --check . && eslint ."
  }
}
```

加完就可以用 `npm run check` 一键跑全部检查。

### 内嵌测验:不需要联网,直接回答

**Q1.** 下面的命令哪个会修改文件?
- A) `npx prettier --check src/`
- B) `npx prettier --write src/`
- C) `npx eslint src/`

**Q2.** 为什么要装 `eslint-config-prettier`?

**Q3.** `.prettierignore` 里一般要排除哪些目录?列出 2 个以上。

**Q4.** 下面哪条配置是 Prettier 负责的,哪条是 ESLint 负责的?
- `"semi": true`(行末加分号)
- `'no-unused-vars': 'warn'`(未使用变量警告)

> 参考答案:Q1→B;Q2→避免 ESLint 的格式规则与 Prettier 冲突;Q3→`node_modules/`、`dist/`、`build/`、`.next/` 等构建产物目录;Q4→前者 Prettier、后者 ESLint。

---

## 📝 毕业测验(必须真做,交证据)

**任务:给一个示例 JS 项目建立完整的 Prettier + ESLint 工作流,并跑出检查报告。**

1. **写出这 4 个配置文件的完整内容**:
   - `.prettierrc`
   - `.prettierignore`
   - `eslint.config.js`
   - `package.json` 里的 `scripts` 段(含 `format:check` 和 `lint`)

2. **写一段"故意写得丑"的测试代码 `src/demo.js`**:
   ```javascript
   // 故意:混用引号、缩进不一致、有未使用变量
   const unusedVar = 42
   function greet(name){
     console.log("Hello, "+name)
       return name
   }
   greet('world')
   ```

3. **预测运行结果**:不真跑的情况下,说出:
   - `npx prettier --check src/demo.js` 会报什么?(格式问题有哪些?)
   - `npx eslint src/demo.js` 会报什么?(逻辑/质量问题有哪些?)

4. **写出修复后的代码**:让 `src/demo.js` 能通过 Prettier 和 ESLint 的检查。

5. **写出验收标准**:
   - `npm run format:check` 退出码为 0(格式全部正确)
   - `npm run lint` 退出码为 0(无 error,warnings 可忽略)
   - 不需要真跑,推理出来也算——但推理要说明每一步逻辑

6. **沉淀技能卡**:把 Prettier/ESLint 核心配置、命令速查、冲突解决方案沉淀成 `skills/prettier-eslint.md`。

> ⚠️ **安全边界:** `npm install` 和 `--write` / `--fix` 系列命令**会修改文件或依赖**——在主人的项目里执行前,必须先征得主人明确确认。`--check` 模式只读不写,可以相对安全地先跑。

---

## 🎓 过关标准

- [ ] 你写出了**完整的 `.prettierrc` 和 `eslint.config.js`**,并能解释每个字段的意思
- [ ] 你能区分 Prettier 和 ESLint **各自管什么**,为什么要装 `eslint-config-prettier`
- [ ] 你能说清楚 `--check` 和 `--write` 的区别,以及什么情况下才能用 `--write`
- [ ] 你预测并写出了 `src/demo.js` 的格式 + 逻辑问题,并写出修复后的版本
- [ ] 你理解 `.prettierignore` 的作用,知道哪些目录该排除
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T33 课。
