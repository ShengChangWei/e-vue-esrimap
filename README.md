# e-vue-esrimap

基于 vue-cli3+TypeScript 的二维地图组件，使用的地图 API 是 ArcGIS API for JavaScript v3.x（>=3.14）。

学习借鉴：<https://github.com/laixiangran/e-ngx-esrimap>

## Usage

1. Install

	```shell
	npm install --save e-vue-esrimap@latest
	```
2. main.js

    ```shell
    import EVueEsrimap from 'e-vue-esrimap/lib/e-vue-esrimap.common.js'
    Vue.use(EVueEsrimap);
    ``
3. template

    ```shell
        <EVueEsrimap
		:mapType="'tdt'"
		:mapUrl="['vec','cva']"
		:submapUrl="[['img','cia'], ['ter','cta']]"
		:geoUrl="geoUrl"
		:initExtent="initExtent"
		:gisApiUrl="gisApiUrl">
        </EVueEsrimap>
    ```

4. js

    ```shell
          data() {
            return {
                initExtent: {xmax: 116.39029888900006, xmin: 116.04209077900009, ymax: 40.161018230000025, ymin: 39.885287565000056},
                gisApiUrl: 'https://js.arcgis.com/3.23/',
                geoUrl: 'https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'
            }
        },
    ```

## API

### Prop

- `isProxy`（`boolean?=false`） - 是否开启代理，可使用 esri 提供的[几个平台的代理文件](https://github.com/Esri/resource-proxy)

- `proxyUrl`（`string?='proxy.jsp'`） - 代理页面的路径。如果出现跨域的问题，请检查是否正确设置代理路径

- `mapUrl`（`string[] | string='http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer'`） - 基础底图路径，如 `mapType='tdt'`，则 mapUrl 可从这四种地图类型 `vec（矢量图层）, cva（矢量标注）, img（影像图层）, cia（影像标注）` 通过数组形式组合使用。如 `mapType='google'`，则 mapUrl 可从这三种地图类型 `m（矢量图层）, p（地形图层）, y（影像图层）` 中选择。mapType='esri'，则 mapUrl 是完整的 ArcGIS 切片地图服务路径

- `submapUrl`（`any[]`）- 其它切换的底图路径，如 `mapType='tdt'`，则 submapUrl 可从这四种地图类型 `vec（矢量图层）, cva（矢量标注）, img（影像图层）, cia（影像标注）` 通过数组形式组合使用。如 `mapType='google'`，则 mapUrl 可从这三种地图类型 `m（矢量图层）, p（地形图层）, y（影像图层）` 中选择。mapType='esri'，则 submapUrl 是完整的 ArcGIS 切片地图服务路径的数组

- `mapType`（`string?='esri'`） - 基础底图类型，`tdt`：天地图（wkid: 4326），`google`：谷歌地图（wkid: 102113），`esri`：esri 地图服务（wkid: 看具体服务wkid）

- `geoUrl`（`string?='http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'`） - 几何服务路径，默认是在线路径，最好配置自己的路径

- `gisApiUrl`（`string?='http://js.arcgis.com/3.23/'`） - arcgis javascript API 路径，默认是在线路径，最好配置自己的路径

- `esriCSSUrl`（`string?='http://js.arcgis.com/3.23/esri/css/esri.css'`） - esri.css 路径，默认是在线路径，最好配置自己的路径

- `initExtent`（`Object`） - 初始地图范围，`{xmax, xmin, ymax, ymin}`。默认范围自适应屏幕显示，如果不想自适应则可调用 setExtent 方法设置范围并指定是否自适应


```javascript
// esri
Map: any;
Color: any;
Graphic: any;
SpatialReference: any;
urlUtils: any;
esriConfig: any;

// esri/tasks
Geoprocessor: any;
GeometryService: any;
FeatureSet: any;
FindTask: any;
FindParameters: any;
IdentifyTask: any;
IdentifyParameters: any;
QueryTask: any;
Query: any;
ProjectParameters: any;
BufferParameters: any;

// esri/layers
ArcGISTiledMapServiceLayer: any;
ArcGISDynamicMapServiceLayer: any;
WebTiledLayer: any;
GraphicsLayer: any;
ImageParameters: any;
TileInfo: any;

// esri/geometry
Extent: any;
Point: any;
ScreenPoint: any;
Polyline: any;
Polygon: any;
WebMercatorUtils: any;

// esri/symbols
PictureMarkerSymbol: any;
SimpleMarkerSymbol: any;
SimpleLineSymbol: any;
CartographicLineSymbol: any;
PictureFillSymbol: any;
SimpleFillSymbol: any;
TextSymbol: any;
Font: any;

// toolbar
Draw: any;
```


## Develop

	```shell
	npm install // 安装依赖包
	
	npm start // 启动项目
	```

# License

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)