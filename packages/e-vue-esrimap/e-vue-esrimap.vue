<template>
	<div class="e-vue-map" style="height: 100%;">
		<div class="eMap" ref="eMap" style="height: 100%;"></div>
		<div class="eNavigation" v-If="enableNavigation">
		<div class="zoom-map full-map" title="全图" @click="fullMap()">
			<i class="fa fa-globe" aria-hidden="true"></i>
		</div>
		<div class="zoom-map zoom-in-map" :class="{'zoom-disable': isMax}" title="放大一级" @click="zoomIn()">
			<i class="fa fa-plus" aria-hidden="true"></i>
		</div>
		<div class="zoom-map zoom-out-map" :class="{'zoom-disable': isMin}" title="缩小一级" @click="zoomOut()">
			<i class="fa fa-minus" aria-hidden="true"></i>
		</div>
	</div>
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
    import EVueErimapLoader from './e-vue-esrimap-loader';

    @Component({
        name: 'EVueEsrimap',
    })
    export default class EVueEsrimap extends Vue {
        eVueErimapLoader: any;
        eMap: any;
        constructor() {
            super();
            this.eVueErimapLoader = new EVueErimapLoader();
        }
		// 输入参数
        @Prop({default: '大家好'}) testValue!: string;
        @Prop({default: 'http://js.arcgis.com/3.23/'}) gisApiUrl!: string;
        @Prop({default: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'}) geoUrl!: string;
        @Prop({default: false}) isProxy!: boolean;
        @Prop({default: 'proxy.jsp'}) proxyUrl!: string;
        @Prop({default: 'esri'}) mapType!: string;
        @Prop({default: 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer'}) mapUrl!: string;
        @Prop({default: ['http://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer']}) submapUrl!: any[];
        @Prop({default: function () {
			return {xmax: 106.39029888900006, xmin: 116.04209077900009, ymax: 40.161018230000025, ymin: 39.885287565000056}
		}}) initExtent: any;
		@Prop({default: 'http://js.arcgis.com/3.23/esri/css/esri.css'}) esriCSSUrl: string = 'http://js.arcgis.com/3.23/esri/css/esri.css'
		@Prop({default: true}) enableNavigation!: boolean;

		// public get _initExtent() {
		// 	return this.initExtent
		// }

		// @Watch('initExtent',  {deep: true})
		// handInitExtemt(val: any) {
		// 	this.initExtent = val;
		// }

		// 输出参数
		// 地图初始化事件
		@Emit('mapReady') mapReady(val?: any) {};
		// 地图销毁事件
		@Emit('mapDestroy') mapDestroy(val?: any) {};
		// 地图范围改变事件
		@Emit('exentChange') exentChange(val?: any) {};
		// 地图切换事件
		@Emit('baseLayerChange') baseLayerChange(val?: any) {};

        private timeOutId!: number; // 定时器id
        private locationLayer: any; // 定位图层
        private basemapIds: any[] = []; // 所有底图id
        private currBaseLayerIndex: number = 0; // 当前底图序号
        private fit: boolean = false;
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

        // ENgxEsriMapComponent
        map: any; // 当前地图实例
        geometryService: any; // 当前几何服务实例
        isMax: boolean = false; // 比例是否最大
        isMin: boolean = false; // 比例是否最小

        mounted() {
            this.addEsriMapCss()
           this.eVueErimapLoader.load({url: this.gisApiUrl}).then(() => {
              this.init();
           }).catch((e:Error)=> {
			   if(e.message === 'The ArcGIS API for JavaScript is already loaded.') {
				   this.init();
			   } else {
				   console.error(e)
			   }
		   })
        }

		destroyed() {
			if(this.map) {
				this.map.destroy();
			}
			this.mapDestroy();
		}

    /**
	 * 初始化esri模块
	 */
	private init(): void {
		this.loadEsriModules([
			'esri/map',
			'esri/urlUtils',
			'esri/config',
			'esri/graphic',
			'esri/Color',
			'esri/SpatialReference',
			'esri/tasks/Geoprocessor',
			'esri/tasks/ProjectParameters',
			'esri/tasks/GeometryService',
			'esri/tasks/FeatureSet',
			'esri/tasks/FindTask',
			'esri/tasks/FindParameters',
			'esri/tasks/IdentifyTask',
			'esri/tasks/IdentifyParameters',
			'esri/tasks/QueryTask',
			'esri/tasks/query',
			'esri/tasks/BufferParameters',
			'esri/layers/ArcGISTiledMapServiceLayer',
			'esri/layers/GraphicsLayer',
			'esri/layers/ImageParameters',
			'esri/layers/TileInfo',
			'esri/layers/WebTiledLayer',
			'esri/layers/ArcGISDynamicMapServiceLayer',
			'esri/geometry/Point',
			'esri/geometry/ScreenPoint',
			'esri/geometry/Extent',
			'esri/geometry/Polyline',
			'esri/geometry/Polygon',
			'esri/geometry/webMercatorUtils',
			'esri/symbols/PictureMarkerSymbol',
			'esri/symbols/SimpleMarkerSymbol',
			'esri/symbols/SimpleLineSymbol',
			'esri/symbols/CartographicLineSymbol',
			'esri/symbols/PictureFillSymbol',
			'esri/symbols/SimpleFillSymbol',
			'esri/symbols/TextSymbol',
			'esri/symbols/Font',
			'esri/toolbars/draw'
		]).then(([
					 Map,
					 urlUtils,
					 esriConfig,
					 Graphic,
					 Color,
					 SpatialReference,
					 Geoprocessor,
					 ProjectParameters,
					 GeometryService,
					 FeatureSet,
					 FindTask,
					 FindParameters,
					 IdentifyTask,
					 IdentifyParameters,
					 QueryTask,
					 Query,
					 BufferParameters,
					 ArcGISTiledMapServiceLayer,
					 GraphicsLayer,
					 ImageParameters,
					 TileInfo,
					 WebTiledLayer,
					 ArcGISDynamicMapServiceLayer,
					 Point,
					 ScreenPoint,
					 Extent,
					 Polyline,
					 Polygon,
					 WebMercatorUtils,
					 PictureMarkerSymbol,
					 SimpleMarkerSymbol,
					 SimpleLineSymbol,
					 CartographicLineSymbol,
					 PictureFillSymbol,
					 SimpleFillSymbol,
					 TextSymbol,
					 Font,
					 Draw
				 ]) => {

			// 初始化模块
			this.Map = Map;
			this.urlUtils = urlUtils;
			this.esriConfig = esriConfig;
			this.Graphic = Graphic;
			this.Color = Color;
			this.SpatialReference = SpatialReference;
			this.Geoprocessor = Geoprocessor;
			this.ProjectParameters = ProjectParameters;
			this.GeometryService = GeometryService;
			this.FeatureSet = FeatureSet;
			this.FindTask = FindTask;
			this.FindParameters = FindParameters;
			this.IdentifyTask = IdentifyTask;
			this.IdentifyParameters = IdentifyParameters;
			this.QueryTask = QueryTask;
			this.Query = Query;
			this.BufferParameters = BufferParameters;
			this.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
			this.GraphicsLayer = GraphicsLayer;
			this.ImageParameters = ImageParameters;
			this.TileInfo = TileInfo;
			this.WebTiledLayer = WebTiledLayer;
			this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
			this.Point = Point;
			this.ScreenPoint = ScreenPoint;
			this.Extent = Extent;
			this.Polyline = Polyline;
			this.Polygon = Polygon;
			this.WebMercatorUtils = WebMercatorUtils;
			this.PictureMarkerSymbol = PictureMarkerSymbol;
			this.SimpleMarkerSymbol = SimpleMarkerSymbol;
			this.SimpleLineSymbol = SimpleLineSymbol;
			this.CartographicLineSymbol = CartographicLineSymbol;
			this.PictureFillSymbol = PictureFillSymbol;
			this.SimpleFillSymbol = SimpleFillSymbol;
			this.TextSymbol = TextSymbol;
			this.Font = Font;
			this.Draw = Draw;

            this.initMap();
            this.addMapEvent();
		});
    }
    
    	/**
	 * 初始化地图
	 */
	private initMap(): void {

		// 初始化几何服务
		if (this.geoUrl) {
			this.geometryService = new this.GeometryService(this.geoUrl);
		} else {
			throw new Error('geoUrl未配置，将导致坐标转换等功能无法使用！');
		}

		// 设置代理
		if (this.isProxy) {
			this.esriConfig.defaults.io.proxyUrl = this.proxyUrl;
			this.esriConfig.defaults.io.alwaysUseProxy = true;
			this.urlUtils.addProxyRule({
				urlPrefix: 'route.arcgis.com',
				proxyUrl: this.proxyUrl
			});
		}

		// 初始化地图
		this.map = new this.Map(this.$refs.eMap, {
			logo: false,
			slider: false
		});

		// 加载底图
		if (this.mapType === 'tdt') {

			// 初始底图
			this.getTdtLayer(Array.isArray(this.mapUrl) ? this.mapUrl : [this.mapUrl]).then((layers: any[]) => {
				const baseamapLayerIds: string[] = [];
				layers.forEach((layer: any, index: number) => {
					baseamapLayerIds.push(layer.id);
					this.map.addLayer(layer);
				});
				this.basemapIds.push(baseamapLayerIds);
			});

			// 切换的其它底图
			this.submapUrl.forEach((submap: string[]) => {
				this.getTdtLayer(Array.isArray(submap) ? submap : [submap]).then((layers: any[]) => {
					const baseamapLayerIds: string[] = [];
					layers.forEach((layer: any, index: number) => {
						layer.setVisibility(false);
						baseamapLayerIds.push(layer.id);
						this.map.addLayer(layer);
					});
					this.basemapIds.push(baseamapLayerIds);
				});
			});
		} else if (this.mapType === 'google') {

			// 初始底图
			this.getGoogleLayer(this.mapUrl).then((layer: any) => {
				const googleMapLayerId: string = `${this.mapType}_base_0`;
				this.basemapIds.push(googleMapLayerId);
				layer.id = googleMapLayerId;
				this.map.addLayer(layer);
			});

			// 切换的其它底图
			this.submapUrl.forEach((submap: any, index: number) => {
				this.getGoogleLayer(submap).then((layer: any) => {
					const googleMapLayerId: string = `${this.mapType}_base_${index + 1}`;
					this.basemapIds.push(googleMapLayerId);
					layer.id = googleMapLayerId;
					layer.setVisibility(false);
					this.map.addLayer(layer);
				});
			});
		}else if (this.mapType === 'baidu') {

			// // 初始底图
			// this.getBaiduLayer(this.mapUrl).then((layer: any) => {
			// 	const googleMapLayerId: string = `${this.mapType}_base_0`;
			// 	this.basemapIds.push(googleMapLayerId);
			// 	layer.id = googleMapLayerId;
			// 	this.map.addLayer(layer);
			// });

			// // 切换的其它底图
			// this.submapUrl.forEach((submap: any, index: number) => {
			// 	this.getBaiduLayer(submap).then((layer: any) => {
			// 		const googleMapLayerId: string = `${this.mapType}_base_${index + 1}`;
			// 		this.basemapIds.push(googleMapLayerId);
			// 		layer.id = googleMapLayerId;
			// 		layer.setVisibility(false);
			// 		this.map.addLayer(layer);
			// 	});
			// });
		} else if (this.mapType === 'esri') {

			// 初始底图
			const esriBasemapLayerId: string = `${this.mapType}_base_0`,
				esriBasemapLayer: any = new this.ArcGISTiledMapServiceLayer(this.mapUrl, {
					id: esriBasemapLayerId
				});
			this.basemapIds.push(esriBasemapLayerId);
			this.map.addLayer(esriBasemapLayer);

			// 切换的其它底图
			this.submapUrl.forEach((submap: string[], index: number) => {
				const esriSubmapLayerId: string = `${this.mapType}_base_${index + 1}`,
					esriSubmapLayer: any = new this.ArcGISTiledMapServiceLayer(submap, {
						id: esriSubmapLayerId
					});
				this.basemapIds.push(esriSubmapLayerId);
				esriSubmapLayer.setVisibility(false);
				this.map.addLayer(esriSubmapLayer);
			});
		} else {
			throw new Error('请指定输入属性 mapType 的值！');
		}
	}

	/**
	 * 获取天地图图层
	 * @param layers 图层的代码
	 * @returns {Promise<T>}
	 */
	private getTdtLayer(layers: string[]): Promise<any> {
		return new Promise((resolve) => {
			const tileInfo: any = new this.TileInfo({
					rows: 256,
					cols: 256,
					compressionQuality: 0,
					origin: {
						x: -180,
						y: 90
					},
					spatialReference: {
						wkid: 4326
					},
					lods: [
						{'level': 2, 'resolution': 0.3515625, 'scale': 147748796.52937502},
						{'level': 3, 'resolution': 0.17578125, 'scale': 73874398.264687508},
						{'level': 4, 'resolution': 0.087890625, 'scale': 36937199.132343754},
						{'level': 5, 'resolution': 0.0439453125, 'scale': 18468599.566171877},
						{'level': 6, 'resolution': 0.02197265625, 'scale': 9234299.7830859385},
						{'level': 7, 'resolution': 0.010986328125, 'scale': 4617149.8915429693},
						{'level': 8, 'resolution': 0.0054931640625, 'scale': 2308574.9457714846},
						{'level': 9, 'resolution': 0.00274658203125, 'scale': 1154287.4728857423},
						{'level': 10, 'resolution': 0.001373291015625, 'scale': 577143.73644287116},
						{'level': 11, 'resolution': 0.0006866455078125, 'scale': 288571.86822143558},
						{'level': 12, 'resolution': 0.00034332275390625, 'scale': 144285.93411071779},
						{'level': 13, 'resolution': 0.000171661376953125, 'scale': 72142.967055358895},
						{'level': 14, 'resolution': 8.58306884765625e-005, 'scale': 36071.483527679447},
						{'level': 15, 'resolution': 4.291534423828125e-005, 'scale': 18035.741763839724},
						{'level': 16, 'resolution': 2.1457672119140625e-005, 'scale': 9017.8708819198619},
						{'level': 17, 'resolution': 1.0728836059570313e-005, 'scale': 4508.9354409599309},
						{'level': 18, 'resolution': 5.3644180297851563e-006, 'scale': 2254.4677204799655}
					]
				}),
				subDomains: string[] = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
				tdtLayers: any[] = [];
			layers.forEach((type) => {
				const templateUrl: string = 'http://${subDomain}.tianditu.com/DataServer?T=' + type + '_c&X=${col}&Y=${row}&L=${level}&tk=8e1a3b0631a1057635c6cc28bece1e31';
				const tdtLayer: any = new this.WebTiledLayer(templateUrl, {
					id: 'tdt_' + type,
					subDomains: subDomains,
					tileInfo: tileInfo
				});
				tdtLayers.push(tdtLayer);
			});
			resolve(tdtLayers);
		});
    }
    
    /**
	 * 获取谷歌图层
	 * @param layer 图层的代码
	 * @returns {Promise<T>}
	 */
	private getGoogleLayer(layer: any): Promise<any> {
		return new Promise((resolve) => {
			const tileInfo: any = new this.TileInfo({
					rows: 256,
					cols: 256,
					compressionQuality: 0,
					origin: {
						'x': -20037508.342787,
						'y': 20037508.342787
					},
					spatialReference: {
						wkid: 102113
					},
					lods: [
						{'level': 0, 'scale': 591657527.591555, 'resolution': 156543.033928},
						{'level': 1, 'scale': 295828763.795777, 'resolution': 78271.5169639999},
						{'level': 2, 'scale': 147914381.897889, 'resolution': 39135.7584820001},
						{'level': 3, 'scale': 73957190.948944, 'resolution': 19567.8792409999},
						{'level': 4, 'scale': 36978595.474472, 'resolution': 9783.93962049996},
						{'level': 5, 'scale': 18489297.737236, 'resolution': 4891.96981024998},
						{'level': 6, 'scale': 9244648.868618, 'resolution': 2445.98490512499},
						{'level': 7, 'scale': 4622324.434309, 'resolution': 1222.99245256249},
						{'level': 8, 'scale': 2311162.217155, 'resolution': 611.49622628138},
						{'level': 9, 'scale': 1155581.108577, 'resolution': 305.748113140558},
						{'level': 10, 'scale': 577790.554289, 'resolution': 152.874056570411},
						{'level': 11, 'scale': 288895.277144, 'resolution': 76.4370282850732},
						{'level': 12, 'scale': 144447.638572, 'resolution': 38.2185141425366},
						{'level': 13, 'scale': 72223.819286, 'resolution': 19.1092570712683},
						{'level': 14, 'scale': 36111.909643, 'resolution': 9.55462853563415},
						{'level': 15, 'scale': 18055.954822, 'resolution': 4.77731426794937},
						{'level': 16, 'scale': 9027.977411, 'resolution': 2.38865713397468},
						{'level': 17, 'scale': 4513.988705, 'resolution': 1.19432856685505},
						{'level': 18, 'scale': 2256.994353, 'resolution': 0.597164283559817},
						{'level': 19, 'scale': 1128.497176, 'resolution': 0.298582141647617}
					]
				}),
				subDomains: string[] = ['mt0', 'mt1', 'mt2', 'mt3'],
				templateUrl: string = 'http://${subDomain}.google.cn/vt/lyrs=' + layer + '&hl=zh-CN&gl=cn&x=${col}&y=${row}&z=${level}&s=Gali',
				googleLayer: any = new this.WebTiledLayer(templateUrl, {
					id: 'google_' + layer,
					subDomains: subDomains,
					tileInfo: tileInfo
				});
			resolve(googleLayer);
		});
	}

//     /**
// 	 * 获取百度图层
// 	 * @param layer 图层的代码
// 	 * @returns {Promise<T>}
// 	 */
// 	private getBaiduLayer(layer: any): Promise<any> {
// 			return new Promise((resolve) => {
// 				const tileInfo: any = new this.TileInfo({
// 					rows: 256,
// 					cols: 256,
// 					compressionQuality: 90,
// 					origin: {
//                         x: -20037508.342787,
//                         y: 20037508.342787
// 					},
// 					spatialReference: {
// 						wkid: 102100
// 					},
// 					lods: [
// 						{ "level": 0, "resolution": 156543.033928, "scale": 591657527.591555 },
//                         { "level": 1, "resolution": 78271.5169639999, "scale": 295828763.795777 },
//                         { "level": 2, "resolution": 39135.7584820001, "scale": 147914381.897889 },
//                         { "level": 3, "resolution": 19567.8792409999, "scale": 73957190.948944 },
//                         { "level": 4, "resolution": 9783.93962049996, "scale": 36978595.474472 },
//                         { "level": 5, "resolution": 4891.96981024998, "scale": 18489297.737236 },
//                         { "level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618 },
//                         { "level": 7, "resolution": 1222.99245256249, "scale": 4622324.434309 },
//                         { "level": 8, "resolution": 611.49622628138, "scale": 2311162.217155 },
//                         { "level": 9, "resolution": 305.748113140558, "scale": 1155581.108577 },
//                         { "level": 10, "resolution": 152.874056570411, "scale": 577790.554289 },
//                         { "level": 11, "resolution": 76.4370282850732, "scale": 288895.277144 },
//                         { "level": 12, "resolution": 38.2185141425366, "scale": 144447.638572 },
//                         { "level": 13, "resolution": 19.1092570712683, "scale": 72223.819286 },
//                         { "level": 14, "resolution": 9.55462853563415, "scale": 36111.909643 },
//                         { "level": 15, "resolution": 4.77731426794937, "scale": 18055.954822 },
//                         { "level": 16, "resolution": 2.38865713397468, "scale": 9027.977411 },
//                         { "level": 17, "resolution": 1.19432856685505, "scale": 4513.988705 },
//                         { "level": 18, "resolution": 0.597164283559817, "scale": 2256.994353 },
//                         { "level": 19, "resolution": 0.298582141647617, "scale": 1128.497176 }
//                     ]
// 				}),
// 				subDomains: string[] = ['online0', 'online1', 'online2', 'online3', 'online4'],
// 				templateUrl: string = 'http://${subDomain}.map.bdimg.com/tile/?qt=tile&x=${col}&y=${row}&z=${level}&styles=pl',
// 				baiduLayer: any = new this.WebTiledLayer(templateUrl, {
// 					id: 'baidu_' + layer,
// 					col: 765,
// 					row: 301,
// 					subDomains: subDomains,
// 					tileInfo: tileInfo
// 				});
// 			resolve(baiduLayer);
// 			})
// 	}

	/**
	 * 底图切换
	 * @param {number} layerIndex
	 */
	changeBaseLayer(layerIndex: number) {
		if (this.currBaseLayerIndex !== layerIndex) {
			this.basemapIds.forEach((mapIds: string | string[], index: number) => {
				if (layerIndex === index) {
					const prevBaseLayerIndex = this.currBaseLayerIndex;
					this.currBaseLayerIndex = layerIndex;
					if (Array.isArray(mapIds)) {
						mapIds.forEach((id: string) => {
							this.map.getLayer(id).setVisibility(true);
						});
					} else {
						this.map.getLayer(mapIds).setVisibility(true);
					}
					this.baseLayerChange({
						prev: prevBaseLayerIndex,
						curr: this.currBaseLayerIndex
					});
				} else {
					if (Array.isArray(mapIds)) {
						mapIds.forEach((id: string) => {
							this.map.getLayer(id).setVisibility(false);
						});
					} else {
						this.map.getLayer(mapIds).setVisibility(false);
					}
				}
			});
		}
	}

    /**
	 * 加载arcgis api for javascript的模块
	 * @param modules
	 * @returns {Promise<any>}
	 */
	loadEsriModules(modules: string[]): Promise<any> {
		return this.eVueErimapLoader.loadModules(modules);
	}

	/**
	 * 地图注册事件
	 */
	private addMapEvent() {
		this.map.on('load', () => {
			if (this.initExtent) {
				this.fit = true;
				this.setExtent(this.initExtent, this.fit).then(() => {
					// this.mapReady.emit(this);
					this.mapReady(this);
				});
			} else {
				this.initExtent = this.map.extent;
				this.mapReady(this);
			}
		});

		this.map.on('extent-change', (event: any) => {
			this.isMax = this.map.getZoom() >= this.map.getMaxZoom();
			this.isMin = this.map.getZoom() <= this.map.getMinZoom();
			this.exentChange(event);
		});
    }
    	/**
	 * 设置地图范围
	 * @param extent
	 * @param {boolean} fit
	 */
	setExtent(extent: any, fit: boolean = false): any {
		this.fit = fit;
		extent.spatialReference = this.map.spatialReference;
		this.initExtent = new this.Extent(extent);
		return this.map.setExtent(this.initExtent, fit);
    }
    
    
	/**
	 * 动态添加esri.css
	 */
	private addEsriMapCss(): void {
		const linkId: string = 'esriCss';
		if (!document.getElementById(linkId)) {
			const head = document.getElementsByTagName('head')[0],
				link = document.createElement('link');
			link.id = linkId;
			link.rel = 'stylesheet';
			link.href = this.esriCSSUrl;
			head.appendChild(link);
		}
	}

		/**
	 * 放大
	 */
	zoomIn() {
		this.isMax = this.map.getZoom() >= this.map.getMaxZoom();
		if (!this.isMax) {
			this.map.setZoom(this.map.getZoom() + 1);
		}
	}

	/**
	 * 缩小
	 */
	zoomOut() {
		this.isMin = this.map.getZoom() <= this.map.getMinZoom();
		if (!this.isMin) {
			this.map.setZoom(this.map.getZoom() - 1);
		}
	}

	/**
	 * 全图
	 */
	fullMap() {
		this.map.setExtent(this.initExtent, this.fit);
	}

}

</script>

<style scoped lang="scss">
	.e-vue-map {
		position: relative;
		width: 100%;
		height: 100%;
		.eMap {
			width: 100%;
			height: 100%;
		}
		.eNavigation {
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: 33px;
        height: 120px;
        font-size: 16px;

        .zoom-map {
            width: 33px;
            height: 36px;
            line-height: 36px;
            cursor: pointer;
            text-align: center;
            color: #757575;
            background-color: #FFFFFF;
            box-shadow: 1px 1px 5px 0 #ADAAAA;

            &.zoom-in-map {
                border-bottom: 1px solid #D9D9D9;
            }

            &.full-map {
                margin-bottom: 10px;
            }

            &:hover {
                color: #03A9F4;
            }

            &.zoom-disable {
                color: #BEBEBE;
                cursor: auto;

                &:hover {
                    color: #BEBEBE;
                }
            }
        }
    }
	}
</style>