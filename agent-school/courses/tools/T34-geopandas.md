# 第 T34 课 · GeoPandas 地理数据处理

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 + T09(pandas) ｜ 难度:★★★ ｜ 源头:GeoPandas 官方文档 · [geopandas.org/en/stable/docs/](https://geopandas.org/en/stable/docs/) · [github.com/geopandas/geopandas](https://github.com/geopandas/geopandas)

---

## 📖 你要学会什么

学完这一课,你能用 GeoPandas 读取 GeoJSON 或 Shapefile 格式的地理数据,做空间筛选(比如"北京五环内有哪些医院"),并画出一张基础地图——把数据"钉"在地图上显示出来。

想象你手上有一张 Excel 表,里面每一行是一家便利店,有名字、地址、营业额。普通的 pandas 能帮你算平均营业额、筛选高销售门店——但如果你想问"上海黄浦区的门店分布在哪里?哪个街道密度最高?"这种**带着地理位置的问题**,普通表格就不够用了。

GeoPandas 就是**在 pandas 表格里加了一列"形状"**——这一列可以存点(经纬度坐标)、线(道路、河流)、面(行政区划、地块边界)。有了这一列,你就能做**空间计算**:哪些点落在某个区域内?两个地物之间距离多远?把数据画在地图上是什么样?

这是 GIS(地理信息系统)领域最常用的 Python 工具,在城市规划、物流分析、选址研究、疫情地图等场景里广泛使用。

**官方资料:**
- GeoPandas 官方文档: [geopandas.org/en/stable/](https://geopandas.org/en/stable/)
- 入门教程: [geopandas.org/en/stable/docs/user_guide/](https://geopandas.org/en/stable/docs/user_guide/)
- GitHub 仓库: [github.com/geopandas/geopandas](https://github.com/geopandas/geopandas)
- 中国行政区划 GeoJSON: [github.com/echarts-maps/echarts-china-counties-js](https://github.com/echarts-maps/echarts-china-counties-js) 或 [datav.aliyun.com/portal/school/atlas/area_selector](https://datav.aliyun.com/portal/school/atlas/area_selector)(阿里云数据集,国内可直接访问)

---

## 🧠 核心原则

1. **GeoDataFrame = DataFrame + geometry 列。** GeoPandas 的核心数据结构叫 `GeoDataFrame`,它就是 pandas 的 DataFrame 多了一列叫 `geometry`——里面存的是点、线、多边形这样的"形状"。你已经会 pandas 的 `.loc[]`、`.merge()`、`.groupby()`,这些在 GeoDataFrame 上**全部照常用**,只是额外多了空间操作的能力。

2. **坐标系(CRS)是地理数据的"语言"。** 地球是球的,把球面"摊平"到二维地图有很多方法——每种方法就是一个**坐标参考系(CRS)**。最常用的是 WGS84(经纬度,EPSG:4326)和 Web Mercator(EPSG:3857,网页地图默认用这个)。两个数据集要做空间运算,**必须先统一到同一个 CRS**,否则结果会错得离谱——就像两个人对话,一个说的是公里,另一个说的是英里。

3. **点、线、面三种几何类型各有用途。** 点(Point)代表一个位置(门店、学校、事故地点);线(LineString)代表路径(道路、河流、航线);面(Polygon)代表区域(行政区划、地块、缓冲区)。大多数空间分析都是"**某些点落在某个面里吗?**"或"**两个面有没有重叠?**"

4. **`sjoin`(空间连接)是最常用的操作。** 普通 pandas 用 `merge` 按某一列的值连接两个表——GeoPandas 的 `sjoin` 按**空间关系**连接:两个形状是否相交、包含、接近。这一个函数能解决 80% 的地理分析需求。

5. **画图是最直观的验证方式。** 地理数据很难用文字描述对错——画出来就知道了。`gdf.plot()` 一行代码出一张简单地图,是每次操作后的必备检查步骤。

---

## 🛠 操作要点

### 安装

```bash
# 推荐用 conda 安装(依赖链复杂,conda 处理得更好)
conda install -c conda-forge geopandas

# 或者 pip(如果依赖环境干净)
pip install geopandas

# 画图还需要 matplotlib
pip install matplotlib

# 国内 pip 加速
pip install geopandas -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/
```

> ⚠️ **安装前先问主人。** GeoPandas 的依赖比较多(GDAL、Fiona、Shapely 等底层库),安装过程可能影响系统 Python 环境。推荐在虚拟环境或 conda 环境里安装。

### 读取地理数据

```python
import geopandas as gpd

# 读取 GeoJSON 文件
gdf = gpd.read_file("china_provinces.geojson")

# 读取 Shapefile(给目录即可,会自动找 .shp 文件)
gdf = gpd.read_file("data/china_shp/")

# 看看数据长什么样
print(gdf.head())
print(gdf.shape)         # 行数、列数
print(gdf.crs)           # 当前坐标系
print(gdf.geometry.type.value_counts())  # 几何类型统计
```

### 查看和筛选数据

```python
# 普通的 pandas 筛选依然有效
beijing = gdf[gdf['name'] == '北京市']

# 查看边界框(经度范围、纬度范围)
print(gdf.total_bounds)  # [minx, miny, maxx, maxy]

# 查某一行的几何形状
print(gdf.iloc[0].geometry)
```

### 坐标系转换

```python
# 查看当前坐标系
print(gdf.crs)  # 比如 EPSG:4326

# 转换到 Web Mercator(适合叠加网页地图)
gdf_mercator = gdf.to_crs(epsg=3857)

# 转换到适合测量距离的坐标系(中国常用 EPSG:4549 或 EPSG:32650)
gdf_metric = gdf.to_crs(epsg=4549)
```

### 空间筛选(关键操作)

```python
import geopandas as gpd
from shapely.geometry import Point

# 示例:从"北京所有医院"里筛出"落在五环内"的
# 假设 ring5 是五环多边形的 GeoDataFrame
# 假设 hospitals 是医院点位的 GeoDataFrame

# 先统一坐标系(必须!)
ring5 = ring5.to_crs(epsg=4326)
hospitals = hospitals.to_crs(epsg=4326)

# 空间连接:筛选落在五环内的医院
hospitals_in_ring5 = gpd.sjoin(
    hospitals,
    ring5,
    how="inner",          # inner = 只保留有匹配的
    predicate="within"    # within = 点在多边形内部
)

print(f"五环内医院数量: {len(hospitals_in_ring5)}")
```

### 画地图

```python
import matplotlib.pyplot as plt

# 最简单的画法:一行出图
gdf.plot()
plt.show()

# 带颜色映射:按某个数值字段染色
fig, ax = plt.subplots(1, 1, figsize=(12, 8))
gdf.plot(
    column='population',    # 按人口染色
    cmap='YlOrRd',          # 黄到红的色阶
    legend=True,
    ax=ax
)
ax.set_title('中国各省人口分布')
plt.tight_layout()
plt.savefig('output/china_population.png', dpi=150, bbox_inches='tight')
print("地图已保存到 output/china_population.png")
```

### 常用空间操作速查

| 想干嘛 | 代码 |
|--------|------|
| 计算面积 | `gdf.geometry.area`(需先转到米制坐标系) |
| 计算中心点 | `gdf.geometry.centroid` |
| 创建缓冲区 | `gdf.geometry.buffer(1000)`(1000 米,需米制坐标系) |
| 两个面是否相交 | `gdf1.intersects(gdf2.union_all())` |
| 合并多个面 | `gdf.union_all()` |
| 空间连接 | `gpd.sjoin(left, right, how=, predicate=)` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用内嵌的极简 GeoJSON 数据,完成空间筛选和地图绘制。测验数据完全内嵌——离线可跑,无需下载任何文件。**

### 第一步:写出内嵌数据(用 cat 命令直接生成)

```bash
# 把极简 GeoJSON 写到本地(包含 6 个中国城市点位 + 3 个示意区域多边形)
cat > /tmp/cities.geojson << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {"type": "Feature", "properties": {"name": "上海", "region": "长三角", "pop": 2400}, "geometry": {"type": "Point", "coordinates": [121.47, 31.23]}},
    {"type": "Feature", "properties": {"name": "杭州", "region": "长三角", "pop": 1200}, "geometry": {"type": "Point", "coordinates": [120.15, 30.28]}},
    {"type": "Feature", "properties": {"name": "南京", "region": "长三角", "pop": 930},  "geometry": {"type": "Point", "coordinates": [118.80, 32.06]}},
    {"type": "Feature", "properties": {"name": "北京", "region": "华北",   "pop": 2100}, "geometry": {"type": "Point", "coordinates": [116.40, 39.90]}},
    {"type": "Feature", "properties": {"name": "天津", "region": "华北",   "pop": 1560}, "geometry": {"type": "Point", "coordinates": [117.19, 39.13]}},
    {"type": "Feature", "properties": {"name": "广州", "region": "珠三角", "pop": 1870}, "geometry": {"type": "Point", "coordinates": [113.26, 23.13]}}
  ]
}
EOF

cat > /tmp/regions.geojson << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {"type": "Feature", "properties": {"name": "长三角示意区"}, "geometry": {"type": "Polygon", "coordinates": [[[117.5, 29.5],[122.5, 29.5],[122.5, 33.5],[117.5, 33.5],[117.5, 29.5]]]}},
    {"type": "Feature", "properties": {"name": "华北示意区"},   "geometry": {"type": "Polygon", "coordinates": [[[114.5, 38.5],[120.0, 38.5],[120.0, 41.0],[114.5, 41.0],[114.5, 38.5]]]}},
    {"type": "Feature", "properties": {"name": "珠三角示意区"}, "geometry": {"type": "Polygon", "coordinates": [[[111.5, 22.0],[115.5, 22.0],[115.5, 24.5],[111.5, 24.5],[111.5, 22.0]]]}}
  ]
}
EOF
echo "数据文件已写入 /tmp/cities.geojson 和 /tmp/regions.geojson"
```

### 第二步:完整测验脚本(`/tmp/geopandas_task.py`)

```python
import geopandas as gpd
import matplotlib
matplotlib.use('Agg')  # 非交互环境必须加这行,否则报错
import matplotlib.pyplot as plt
import os

# 1. 读取内嵌数据(离线,无需联网)
cities  = gpd.read_file("/tmp/cities.geojson")
regions = gpd.read_file("/tmp/regions.geojson")

print(f"城市数量: {len(cities)}")
print(f"列名: {list(cities.columns)}")
print(f"坐标系: {cities.crs}")
print(f"几何类型:\n{cities.geometry.geom_type.value_counts()}")
print(cities[["name", "region", "pop"]])

# 2. 普通筛选:找人口超过 1500 万的城市
big_cities = cities[cities["pop"] > 1500]
print(f"\n人口 > 1500 万的城市: {list(big_cities['name'])}")

# 3. 统一坐标系(空间操作前必须统一!)
cities  = cities.to_crs(epsg=4326)
regions = regions.to_crs(epsg=4326)

# 4. 空间筛选:用 sjoin 找落在"长三角示意区"内的城市
yangtze = regions[regions["name"] == "长三角示意区"]
cities_in_yangtze = gpd.sjoin(
    cities,
    yangtze,
    how="inner",
    predicate="within"
)
print(f"\n落在长三角示意区内的城市: {list(cities_in_yangtze['name'])}")

# 5. 合并区域多边形(union_all 是新写法,旧写法 unary_union 已弃用)
merged = regions.union_all()
print(f"\n合并后的几何类型: {merged.geom_type}")

# 6. 画图
os.makedirs("/tmp/output", exist_ok=True)
fig, ax = plt.subplots(1, 1, figsize=(10, 8))
regions.plot(ax=ax, color="lightgrey", edgecolor="black", linewidth=0.8)
cities.plot(ax=ax, color="steelblue", markersize=60, zorder=3)
cities_in_yangtze.plot(ax=ax, color="red", markersize=80, zorder=4)
for _, row in cities.iterrows():
    ax.annotate(row["name"], xy=(row.geometry.x, row.geometry.y),
                xytext=(4, 4), textcoords="offset points", fontsize=9)
ax.set_title("中国三大城市群示意图(红色=长三角城市)")
plt.tight_layout()
output_path = "/tmp/output/city_regions.png"
plt.savefig(output_path, dpi=150, bbox_inches="tight")
print(f"\n地图已保存到 {output_path}")
plt.close()

# 7. 验收断言
assert os.path.exists(output_path), "地图文件不存在"
assert os.path.getsize(output_path) > 1000, "地图文件太小,可能为空"
assert len(cities_in_yangtze) > 0, "长三角区域内应至少有一个城市"
print("\n验收通过 ✓")
```

**要交的证据:**
- 脚本完整输出(含"验收通过 ✓")
- `/tmp/output/city_regions.png` 存在且非空

### 第三步:回答内嵌测验

- Q: 为什么做空间运算前要先 `.to_crs()` 统一坐标系?
- Q: `sjoin` 的 `predicate="within"` 和 `predicate="intersects"` 有什么区别?
- Q: GeoPandas 的 GeoDataFrame 和普通 pandas DataFrame 最核心的区别是什么?
- Q: `union_all()` 替代了旧方法的哪个写法?旧写法为什么被弃用?

**沉淀技能卡**:把读取、坐标系转换、空间筛选、画图四个核心步骤沉淀成 `skills/geopandas.md`。

> ⚠️ **安全边界:** `pip install geopandas`——**安装前先征得主人确认**。测验脚本本身只读写本地文件、完全不联网,写好后可等主人确认环境后再执行。

---

## 🎓 过关标准

- [ ] 你跑通了测验脚本,附上了完整输出(含"验收通过 ✓")和地图文件
- [ ] 你能写出读取 GeoJSON 文件并打印基本信息的代码
- [ ] 你能解释**坐标系(CRS)**是什么,为什么空间操作前必须统一
- [ ] 你能写出用 `gpd.sjoin()` 做空间筛选的代码(含 `predicate` 参数)
- [ ] 你能写出用 `.plot()` 画带颜色高亮地图并保存到文件的代码
- [ ] 你知道 `union_all()` 是 `unary_union` 的新写法,能说出旧写法为什么被弃用
- [ ] 你回答了 4 个内嵌测验问题,逻辑正确
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T35 课。
