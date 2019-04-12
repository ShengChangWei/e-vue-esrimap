<template>
	<div id="app">
		        <h2>谷歌地图服务</h2>
        <e-vue-esrimap
            :mapType="'google'"
            :mapUrl="'m'"
            :submapUrl="['y', 'p']"
            :geoUrl="geoUrl"
            :initExtent="initExtent2"
            :gisApiUrl="gisApiUrl"
            v-on:baseLayerChange="onGoogleBaseLayerChange($event)"
            v-on:mapReady="onGoogleMapReady($event)">
        </e-vue-esrimap>

        <h2>天地图地图服务</h2>
        <e-vue-esrimap
            :mapType="'tdt'"
            :mapUrl="['vec','cva']"
            :submapUrl="[['img','cia'], ['ter','cta']]"
            :geoUrl="geoUrl"
            :initExtent="initExtent"
            :gisApiUrl="gisApiUrl"
            v-on:baseLayerChange="onTdtBaseLayerChange($event)"
            v-on:mapReady="onTdtMapReady($event)">
        </e-vue-esrimap>

        <h2>ArcGIS地图服务</h2>

        <e-vue-esrimap
            :isProxy="false"
            :mapUrl="mapUrl"
            :submapUrl="['http://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer']"
            :geoUrl="geoUrl"
            :initExtent="initExtent"
            :gisApiUrl="gisApiUrl"
            :esriCSSUrl="esriCSSUrl"
            v-on:baseLayerChange="onEsriBaseLayerChange($event)"
            v-on:mapReady="onEsriMapReady($event)">
        </e-vue-esrimap>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

    @Component({
        components: {
        },
    })
    export default class App extends Vue {
public googleMapComponent: any;
public googleMap: any;
public tdtMapComponent: any;
public tdtMap: any;
public esriMapComponent: any;
public esriMap: any;
public mapUrl: string = 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer';
public geoUrl: string = 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer';
public gisApiUrl: string = 'http://js.arcgis.com/3.23/';
public esriCSSUrl: string = 'http://js.arcgis.com/3.23/esri/css/esri.css';
public initExtent: any = {xmax: 116.39029888900006, xmin: 116.04209077900009, ymax: 40.161018230000025, ymin: 39.885287565000056};
public initExtent2: any = {xmax: 12980277.986602597, xmin: 12934415.769631553, ymax: 4864627.423165954, ymin: 4841696.314680432};

/**
 * 谷歌地图加载完成
 * @param $event
 */
public onGoogleMapReady($event: any) {
    this.googleMapComponent = $event;
    this.googleMap = this.googleMapComponent.map;
}

/**
 * 谷歌底图切换
 * @param {number} $event
 */
public onGoogleBaseLayerChange($event: number) {
    console.log($event);
}

/**
 * 天地图地图加载完成
 * @param $event
 */
public onTdtMapReady($event: any) {
    this.tdtMapComponent = $event;
    this.tdtMap = this.tdtMapComponent.map;
    this.tdtMapComponent.setExtent(this.initExtent);
}

/**
 * 天地图底图切换
 * @param {number} $event
 */
public onTdtBaseLayerChange($event: number) {
    console.log($event);
}

/**
 * esri地图加载完成
 * @param $event
 */
public onEsriMapReady($event: any) {
    this.esriMapComponent = $event;
    this.esriMap = this.esriMapComponent.map;
}

/**
 * esri底图切换
 * @param {number} $event
 */
public onEsriBaseLayerChange($event: number) {
    console.log($event);
}
    }
</script>

<style lang="scss">
	html,body {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	#app {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
        overflow-x: hidden;
	}
</style>
