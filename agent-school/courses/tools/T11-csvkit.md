# 第 T11 课 · csvkit 命令行切表/合表/转格式

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:csvkit 官方文档 · [csvkit.readthedocs.io](https://csvkit.readthedocs.io/) · GitHub: [wireservice/csvkit](https://github.com/wireservice/csvkit) · PyPI: [csvkit 2.2.0](https://pypi.org/project/csvkit/)

---

## 📖 你要学会什么

学完这一课,你能在命令行里像切豆腐一样对 CSV 文件动刀——切出几列、过滤几行、合并两张表、查汇总统计——一行命令搞定,不用写 Python、不用打开 Excel。

想象你是一个厨房里的备菜师傅。主人扔给你一棵大白菜(一张大 CSV 表),说:"我只要菜心、不要外叶,帮我切成细丝、配上另一盘萝卜、撒上统计数字。" 你需要的是一把趁手的菜刀——而不是端出来整台炒菜机。**csvkit 就是那把菜刀**:每个命令干一件事,干得快、干得准。

csvkit 2.2.0 是一套命令行工具套件,pip 装好就能直接用,底层是 Python。它的所有工具都支持管道(`|`):上一个命令的输出是下一个命令的输入,就像流水线——**`csvcut | csvgrep | csvstat` 三把刀一起用,一行解决问题**。

**官方资料:**
- 文档: [csvkit.readthedocs.io](https://csvkit.readthedocs.io/)
- 入门教程: [csvkit.readthedocs.io/en/latest/tutorial/1_getting_started](https://csvkit.readthedocs.io/en/latest/tutorial/1_getting_started.html)
- GitHub: [github.com/wireservice/csvkit](https://github.com/wireservice/csvkit)
- PyPI: [pypi.org/project/csvkit](https://pypi.org/project/csvkit/)

---

## 🧠 核心原则(内化成习惯)

1. **每个工具只干一件事,用管道串起来。** `csvcut`(切列)、`csvgrep`(过滤行)、`csvstat`(统计)、`csvjoin`(合表)——每把刀只砍一种东西。复杂需求用 `|` 管道组合,不要想着找一个"全能命令"。

2. **`-n` 先看列编号,再动刀。** `csvcut -n file.csv` 列出所有列名和编号——就像看菜单再点菜。不知道列号就乱写命令,像蒙眼切菜,一刀下去切错了。

3. **编码问题要提前处理。** 中文 CSV 文件可能是 UTF-8、GBK 或 UTF-8-BOM,遇到乱码先加 `-e gbk`(或 `-e utf-8-sig`)参数。csvkit 命令都支持 `-e` 指定编码。

4. **管道中间任何一步都可以先 `| head -5` 看中间结果。** 不确定当前步骤输出对不对?在管道里临时加 `| head -5` 看前几行,确认对了再接下一步。像烧菜尝味道一样——中途尝一口再加盐。

5. **`csvsql` 能在命令行直接跑 SQL,是最后的大招。** 上面的工具解决不了的复杂需求,`csvsql --query "SELECT ..."` 让你对 CSV 写 SQL——不装数据库、不写 Python,直接查。

---

## 🛠 操作要点

### 安装

```bash
pip install csvkit
```

安装后会多出这些命令:`csvcut`、`csvgrep`、`csvjoin`、`csvlook`、`csvstat`、`csvstack`、`csvformat`、`csvsql`、`in2csv`

> 🇨🇳 **中国用户提示:** pip 直接安装,无需科学上网。加速可用清华镜像:
> `pip install csvkit -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 先生成测试数据(完全离线)

```bash
# 生成员工表
cat > /tmp/employees.csv << 'EOF'
id,姓名,部门,城市,月薪,入职年份
1,王芳,技术,北京,22000,2021
2,李明,市场,上海,15000,2022
3,张强,技术,北京,28000,2020
4,刘娟,市场,广州,14000,2022
5,陈浩,运营,深圳,13000,2023
6,赵磊,技术,北京,25000,2021
7,孙梅,运营,上海,12000,2023
8,周伟,市场,广州,16000,2021
EOF

# 生成部门表(用于 join)
cat > /tmp/departments.csv << 'EOF'
部门,负责人,预算
技术,赵总,500000
市场,钱总,300000
运营,孙总,200000
EOF
```

### 核心工具演示

```bash
# 1. csvlook:美化打印,看表长什么样
csvlook /tmp/employees.csv

# 2. csvcut:切列(只保留姓名、部门、月薪)
csvcut -c 姓名,部门,月薪 /tmp/employees.csv

# 用列编号也行(先 -n 看编号)
csvcut -n /tmp/employees.csv
csvcut -c 2,3,5 /tmp/employees.csv

# 3. csvgrep:过滤行(只留技术部门)
csvgrep -c 部门 -m 技术 /tmp/employees.csv

# 过滤+切列 组合管道:技术部人员的姓名和月薪
csvgrep -c 部门 -m 技术 /tmp/employees.csv | csvcut -c 姓名,月薪

# 4. csvstat:统计摘要
csvstat /tmp/employees.csv
# 只看月薪列的统计
csvcut -c 月薪 /tmp/employees.csv | csvstat

# 5. csvjoin:按列合并两张表(类似 SQL JOIN)
csvjoin -c 部门 /tmp/employees.csv /tmp/departments.csv

# 6. csvstack:纵向合并两个结构相同的 CSV(追加行)
# 先复制一份做演示
cp /tmp/employees.csv /tmp/employees_q2.csv
csvstack /tmp/employees.csv /tmp/employees_q2.csv | wc -l

# 7. csvsql:直接对 CSV 跑 SQL
csvsql --query "SELECT 部门, AVG(月薪) AS 平均月薪, COUNT(*) AS 人数
                FROM employees
                GROUP BY 部门
                ORDER BY 平均月薪 DESC" /tmp/employees.csv

# 8. in2csv:把 Excel 转成 CSV(需要文件存在)
# in2csv data.xlsx > output.csv

# 9. csvformat:转换编码/分隔符
csvformat -D "|" /tmp/employees.csv  # 把逗号改成竖线分隔符
```

### 组合管道:一条命令完成多步操作

```bash
# 找出月薪 > 20000 的技术部员工,只显示姓名和月薪,美化展示
csvgrep -c 部门 -m 技术 /tmp/employees.csv \
  | csvgrep -c 月薪 -r "^[2-9][0-9]{4}" \
  | csvcut -c 姓名,月薪 \
  | csvlook

# 合并两表后统计各部门平均薪资
csvjoin -c 部门 /tmp/employees.csv /tmp/departments.csv \
  | csvsql --query "SELECT 部门, 负责人, AVG(月薪) AS 平均月薪
                    FROM stdin GROUP BY 部门, 负责人"

# 把结果保存到文件
csvcut -c 姓名,部门,月薪 /tmp/employees.csv > /tmp/slim_employees.csv
```

### 命令速查表

| 工具 | 作用 | 关键参数 |
|------|------|---------|
| `csvlook` | 美化打印表格 | — |
| `csvcut` | 选列/删列 | `-c 列名或编号` `-n` 看列号 |
| `csvgrep` | 过滤行 | `-c 列` `-m 精确值` `-r 正则` |
| `csvstat` | 统计摘要 | — |
| `csvjoin` | 按列合并(JOIN) | `-c 关联列` |
| `csvstack` | 纵向合并(追加行) | — |
| `csvsql` | 对文件跑 SQL | `--query "SQL"` |
| `in2csv` | Excel/JSON→CSV | — |
| `csvformat` | 改分隔符/编码 | `-D 分隔符` `-e 编码` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 csvkit 完成 4 个命令行操作,附真实输出。测验数据内嵌,完全离线。**

**第一步:准备测试数据**

```bash
cat > /tmp/orders.csv << 'EOF'
order_id,客户,城市,产品类别,金额,状态
O001,王小明,北京,电子,3500,已完成
O002,李小红,上海,服装,280,已完成
O003,张大强,广州,食品,650,已取消
O004,刘小丽,北京,电子,8900,已完成
O005,陈小浩,深圳,服装,430,待处理
O006,赵小磊,上海,电子,12000,已完成
O007,孙小梅,北京,食品,320,待处理
O008,周小伟,广州,服装,760,已完成
EOF
```

**完成以下 4 个操作并附真实命令 + 输出:**

1. **操作一:看列名编号**
   ```bash
   csvcut -n /tmp/orders.csv
   ```

2. **操作二:切出"客户、城市、金额"三列并美化展示**
   ```bash
   csvcut -c 客户,城市,金额 /tmp/orders.csv | csvlook
   ```

3. **操作三:筛选"已完成"订单,统计金额列**
   ```bash
   csvgrep -c 状态 -m 已完成 /tmp/orders.csv | csvcut -c 金额 | csvstat
   ```

4. **操作四:用 SQL 统计各城市已完成订单的总金额,排序输出**
   ```bash
   csvsql --query "SELECT 城市, COUNT(*) AS 订单数, SUM(金额) AS 总金额
                   FROM orders
                   WHERE 状态='已完成'
                   GROUP BY 城市
                   ORDER BY 总金额 DESC" /tmp/orders.csv
   ```

**验收标准:**
- 操作一:输出 6 列的名称和编号
- 操作二:美化表格有 8 行数据(含表头)
- 操作三:`csvstat` 输出 `Sum` 字段显示已完成订单金额之和
- 操作四:SQL 输出按总金额排序的城市汇总

**沉淀技能卡**:把8个工具的速查表 + 管道组合示例沉淀成 `skills/csvkit.md`。

> ⚠️ **安全边界:** `pip install csvkit` 需先经主人确认。csvkit 是纯本地命令行工具,不联网,只读写本地文件。`csvsql` 可以连接真实数据库(通过 `--db` 参数)——如果要连真实数据库,**必须先经主人确认**。

---

## 🎓 过关标准

- [ ] 你跑过以上 4 个操作并附上了真实命令 + 输出(不是手写的)
- [ ] 你用过 `|` 管道把 `csvcut` 和 `csvgrep` 串起来
- [ ] 你用过 `csvsql --query` 对 CSV 直接跑 SQL
- [ ] 你能说清楚 `-n` 的作用(先看列编号再动刀)
- [ ] 你能说清楚 `csvstack` 和 `csvjoin` 的区别(纵向追加行 vs 横向关联列)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T12 课。
