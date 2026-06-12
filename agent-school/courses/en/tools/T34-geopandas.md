> 🌐 English ｜ [中文](../../tools/T34-geopandas.md)

# Lesson T34 · GeoPandas: Working with Geographic Data

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + T09 (pandas) ｜ Difficulty: ★★★ ｜ Source: GeoPandas official docs · [geopandas.org/en/stable/docs/](https://geopandas.org/en/stable/docs/) · [github.com/geopandas/geopandas](https://github.com/geopandas/geopandas)

---

## 📖 What you'll learn

After this lesson, you'll be able to use GeoPandas to load GeoJSON or Shapefile geographic data, perform spatial filtering (e.g., "which hospitals are inside the 5th Ring Road in Beijing?"), and draw a basic map — pinning data points onto a geographic display.

Imagine you have a spreadsheet where each row is a convenience store, with columns for name, address, and revenue. Regular pandas can calculate average revenue or filter high-performing stores. But if you want to ask "how are the stores distributed across Shanghai's Huangpu District? Which neighborhood has the highest density?" — questions that are inherently about **location** — a regular table falls short.

GeoPandas is **a pandas table with an extra column for "shape"** — this column can hold points (latitude/longitude coordinates), lines (roads, rivers), or polygons (administrative boundaries, land parcels). With that column, you can do **spatial computation**: which points fall inside a given area? How far apart are two features? What does this data look like on a map?

This is the most widely used Python tool in GIS (Geographic Information Systems), applied in urban planning, logistics analysis, site selection, epidemiological mapping, and many other domains.

**Official resources:**
- GeoPandas official docs: [geopandas.org/en/stable/](https://geopandas.org/en/stable/)
- Getting started tutorial: [geopandas.org/en/stable/docs/user_guide/](https://geopandas.org/en/stable/docs/user_guide/)
- GitHub repository: [github.com/geopandas/geopandas](https://github.com/geopandas/geopandas)

---

## 🧠 Core principles (internalize these as habits)

1. **GeoDataFrame = DataFrame + a geometry column.** GeoPandas's core data structure is a `GeoDataFrame` — it's just a pandas DataFrame with one extra column called `geometry` that stores shapes: points, lines, or polygons. Everything you already know from pandas — `.loc[]`, `.merge()`, `.groupby()` — **works exactly the same on a GeoDataFrame**. You just gain extra spatial operations on top.

2. **CRS (Coordinate Reference System) is the "language" of geographic data.** The Earth is a sphere; projecting that sphere onto a flat 2D map can be done many different ways — each method is a **Coordinate Reference System (CRS)**. The most common are WGS84 (lat/lon degrees, EPSG:4326) and Web Mercator (EPSG:3857, the default for web maps). When doing spatial calculations with two datasets, **they must first be converted to the same CRS** — otherwise the results will be wildly wrong. Think of two people talking, one in kilometers and one in miles.

3. **Three geometry types — each serves a purpose.** Point: a single location (store, school, accident site). LineString: a path (road, river, flight route). Polygon: an area (administrative boundary, land parcel, buffer zone). Most spatial analysis boils down to "**do these points fall inside this polygon?**" or "**do these two polygons overlap?**"

4. **`sjoin` (spatial join) is the most used operation.** Regular pandas uses `merge` to join two tables on matching column values — GeoPandas's `sjoin` joins based on **spatial relationships**: do two shapes intersect, is one contained within the other, are they nearby? This one function handles 80% of geographic analysis needs.

5. **Plotting is the most intuitive way to verify your work.** Geographic data is hard to describe correctly in words — draw it and you'll know immediately. `gdf.plot()` produces a simple map in one line of code and should be your first check after every operation.

---

## 🛠 How to do it

### Installation

```bash
# Recommended: install via conda (the dependency chain is complex; conda handles it better)
conda install -c conda-forge geopandas

# Or pip (if the dependency environment is clean)
pip install geopandas

# Plotting also requires matplotlib
pip install matplotlib
```

> ⚠️ **Ask the owner before installing.** GeoPandas has many dependencies (GDAL, Fiona, Shapely, and other lower-level libraries); installation can affect the system Python environment. Recommended: install inside a virtual environment or conda environment.

### Reading geographic data

```python
import geopandas as gpd

# Read a GeoJSON file
gdf = gpd.read_file("regions.geojson")

# Read a Shapefile (pass the directory; it auto-finds the .shp file)
gdf = gpd.read_file("data/shapes/")

# Inspect the data
print(gdf.head())
print(gdf.shape)         # rows and columns
print(gdf.crs)           # current CRS
print(gdf.geometry.type.value_counts())  # geometry type breakdown
```

### Viewing and filtering data

```python
# Regular pandas filtering works as-is
northeast = gdf[gdf['region'] == 'Northeast']

# Check the bounding box (longitude/latitude range)
print(gdf.total_bounds)  # [minx, miny, maxx, maxy]

# View the geometry of one row
print(gdf.iloc[0].geometry)
```

### CRS conversion

```python
# Check the current CRS
print(gdf.crs)  # e.g. EPSG:4326

# Convert to Web Mercator (useful for overlaying on web maps)
gdf_mercator = gdf.to_crs(epsg=3857)

# Convert to a metric CRS suitable for distance measurement
gdf_metric = gdf.to_crs(epsg=32650)
```

### Spatial filtering (the key operation)

```python
import geopandas as gpd
from shapely.geometry import Point

# Example: from all hospitals in the dataset, keep only those inside a given boundary polygon
# Assume: boundary is a GeoDataFrame containing the boundary polygon
# Assume: hospitals is a GeoDataFrame of hospital point locations

# Unify CRS first (mandatory!)
boundary = boundary.to_crs(epsg=4326)
hospitals = hospitals.to_crs(epsg=4326)

# Spatial join: keep only hospitals inside the boundary
hospitals_inside = gpd.sjoin(
    hospitals,
    boundary,
    how="inner",          # inner = keep only matched rows
    predicate="within"    # within = point is inside the polygon
)

print(f"Hospitals inside boundary: {len(hospitals_inside)}")
```

### Drawing a map

```python
import matplotlib.pyplot as plt

# Simplest plot: one line
gdf.plot()
plt.show()

# Choropleth map: color by a numeric field
fig, ax = plt.subplots(1, 1, figsize=(12, 8))
gdf.plot(
    column='population',    # color by population
    cmap='YlOrRd',          # yellow-to-red color scale
    legend=True,
    ax=ax
)
ax.set_title('Population Distribution by Region')
plt.tight_layout()
plt.savefig('output/population_map.png', dpi=150, bbox_inches='tight')
print("Map saved to output/population_map.png")
```

### Common spatial operations quick reference

| What you want to do | Code |
|---------------------|------|
| Calculate area | `gdf.geometry.area` (requires metric CRS first) |
| Find centroid | `gdf.geometry.centroid` |
| Create buffer zone | `gdf.geometry.buffer(1000)` (1000 m — requires metric CRS) |
| Check if two polygons intersect | `gdf1.intersects(gdf2.union_all())` |
| Merge multiple polygons | `gdf.union_all()` |
| Spatial join | `gpd.sjoin(left, right, how=, predicate=)` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: using fully embedded GeoJSON data, complete a spatial filter and draw a map. All test data is self-contained — runs offline, no file downloads needed.**

### Step 1: write the embedded data (generate with a cat command)

```bash
# Write minimal GeoJSON to local files
# (6 city points + 3 representative region polygons)
cat > /tmp/cities.geojson << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {"type": "Feature", "properties": {"name": "Shanghai",  "region": "Yangtze Delta", "pop": 2400}, "geometry": {"type": "Point", "coordinates": [121.47, 31.23]}},
    {"type": "Feature", "properties": {"name": "Hangzhou",  "region": "Yangtze Delta", "pop": 1200}, "geometry": {"type": "Point", "coordinates": [120.15, 30.28]}},
    {"type": "Feature", "properties": {"name": "Nanjing",   "region": "Yangtze Delta", "pop": 930},  "geometry": {"type": "Point", "coordinates": [118.80, 32.06]}},
    {"type": "Feature", "properties": {"name": "Beijing",   "region": "North China",   "pop": 2100}, "geometry": {"type": "Point", "coordinates": [116.40, 39.90]}},
    {"type": "Feature", "properties": {"name": "Tianjin",   "region": "North China",   "pop": 1560}, "geometry": {"type": "Point", "coordinates": [117.19, 39.13]}},
    {"type": "Feature", "properties": {"name": "Guangzhou", "region": "Pearl River Delta", "pop": 1870}, "geometry": {"type": "Point", "coordinates": [113.26, 23.13]}}
  ]
}
EOF

cat > /tmp/regions.geojson << 'EOF'
{
  "type": "FeatureCollection",
  "features": [
    {"type": "Feature", "properties": {"name": "Yangtze Delta (approx)"},    "geometry": {"type": "Polygon", "coordinates": [[[117.5, 29.5],[122.5, 29.5],[122.5, 33.5],[117.5, 33.5],[117.5, 29.5]]]}},
    {"type": "Feature", "properties": {"name": "North China (approx)"},       "geometry": {"type": "Polygon", "coordinates": [[[114.5, 38.5],[120.0, 38.5],[120.0, 41.0],[114.5, 41.0],[114.5, 38.5]]]}},
    {"type": "Feature", "properties": {"name": "Pearl River Delta (approx)"}, "geometry": {"type": "Polygon", "coordinates": [[[111.5, 22.0],[115.5, 22.0],[115.5, 24.5],[111.5, 24.5],[111.5, 22.0]]]}}
  ]
}
EOF
echo "Data files written to /tmp/cities.geojson and /tmp/regions.geojson"
```

### Step 2: full test script (`/tmp/geopandas_task.py`)

```python
import geopandas as gpd
import matplotlib
matplotlib.use('Agg')  # required for non-interactive environments, otherwise errors
import matplotlib.pyplot as plt
import os

# 1. Read embedded data (offline — no network needed)
cities  = gpd.read_file("/tmp/cities.geojson")
regions = gpd.read_file("/tmp/regions.geojson")

print(f"Number of cities: {len(cities)}")
print(f"Columns: {list(cities.columns)}")
print(f"CRS: {cities.crs}")
print(f"Geometry types:\n{cities.geometry.geom_type.value_counts()}")
print(cities[["name", "region", "pop"]])

# 2. Regular filter: find cities with population > 1500 (units: 10k)
big_cities = cities[cities["pop"] > 1500]
print(f"\nCities with pop > 1500: {list(big_cities['name'])}")

# 3. Unify CRS (mandatory before spatial operations!)
cities  = cities.to_crs(epsg=4326)
regions = regions.to_crs(epsg=4326)

# 4. Spatial filter: use sjoin to find cities inside the Yangtze Delta region
yangtze = regions[regions["name"] == "Yangtze Delta (approx)"]
cities_in_yangtze = gpd.sjoin(
    cities,
    yangtze,
    how="inner",
    predicate="within"
)
print(f"\nCities inside Yangtze Delta: {list(cities_in_yangtze['name'])}")

# 5. Merge all region polygons (union_all is the modern API; unary_union is deprecated)
merged = regions.union_all()
print(f"\nMerged geometry type: {merged.geom_type}")

# 6. Draw the map
os.makedirs("/tmp/output", exist_ok=True)
fig, ax = plt.subplots(1, 1, figsize=(10, 8))
regions.plot(ax=ax, color="lightgrey", edgecolor="black", linewidth=0.8)
cities.plot(ax=ax, color="steelblue", markersize=60, zorder=3)
cities_in_yangtze.plot(ax=ax, color="red", markersize=80, zorder=4)
for _, row in cities.iterrows():
    ax.annotate(row["name"], xy=(row.geometry.x, row.geometry.y),
                xytext=(4, 4), textcoords="offset points", fontsize=9)
ax.set_title("Three Major City Clusters (red = Yangtze Delta cities)")
plt.tight_layout()
output_path = "/tmp/output/city_regions.png"
plt.savefig(output_path, dpi=150, bbox_inches="tight")
print(f"\nMap saved to {output_path}")
plt.close()

# 7. Acceptance assertions
assert os.path.exists(output_path), "Map file does not exist"
assert os.path.getsize(output_path) > 1000, "Map file is too small — may be empty"
assert len(cities_in_yangtze) > 0, "At least one city should be inside the Yangtze Delta region"
print("\nAll checks passed ✓")
```

**Evidence to submit:**
- Full script output (including "All checks passed ✓")
- `/tmp/output/city_regions.png` exists and is non-empty

### Step 3: answer the embedded questions

- Q: Why must you call `.to_crs()` to unify the CRS before doing spatial operations?
- Q: What is the difference between `predicate="within"` and `predicate="intersects"` in `sjoin`?
- Q: What is the most fundamental difference between a GeoPandas GeoDataFrame and a regular pandas DataFrame?
- Q: `union_all()` replaced which older method? Why was the old method deprecated?

**Distill a skill card:** condense the four core steps — reading data, CRS conversion, spatial filtering, and drawing maps — into `skills/geopandas.md`.

> ⚠️ **Safety boundary:** `pip install geopandas` — **ask the owner for confirmation before installing.** The test script itself only reads and writes local files, uses no network, and is safe to run once the environment is confirmed.

---

## 🎓 Pass criteria

- [ ] You ran the test script and attached the full output (including "All checks passed ✓") and the map file
- [ ] You can write code that reads a GeoJSON file and prints basic metadata
- [ ] You can explain what a **CRS** is and why spatial operations require a unified CRS
- [ ] You can write spatial filtering code using `gpd.sjoin()` (including the `predicate` parameter)
- [ ] You can write code that draws a map with color highlights and saves it to a file using `.plot()`
- [ ] You know that `union_all()` is the replacement for `unary_union` and can explain why the old API was deprecated
- [ ] You answered all 4 embedded questions with correct reasoning
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T35.
