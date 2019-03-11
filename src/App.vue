<template>
	<div id="app">
		        <h2>谷歌地图服务</h2>
        <EVueEsrimap
            :mapType="'google'"
            :mapUrl="'m'"
            :submapUrl="['y', 'p']"
            :geoUrl="geoUrl"
            :initExtent="initExtent2"
            :gisApiUrl="gisApiUrl"
            v-on:baseLayerChange="onGoogleBaseLayerChange($event)"
            v-on:mapReady="onGoogleMapReady($event)">
        </EVueEsrimap>

        <h2>天地图地图服务</h2>
        <EVueEsrimap
            :mapType="'tdt'"
            :mapUrl="['vec','cva']"
            :submapUrl="[['img','cia'], ['ter','cta']]"
            :geoUrl="geoUrl"
            :initExtent="initExtent"
            :gisApiUrl="gisApiUrl"
            v-on:baseLayerChange="onTdtBaseLayerChange($event)"
            v-on:mapReady="onTdtMapReady($event)">
        </EVueEsrimap>

        <h2>ArcGIS地图服务</h2>

        <EVueEsrimap
            :isProxy="false"
            :mapUrl="mapUrl"
            :submapUrl="['http://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer']"
            :geoUrl="geoUrl"
            :initExtent="initExtent"
            :gisApiUrl="gisApiUrl"
            :esriCSSUrl="esriCSSUrl"
            v-on:baseLayerChange="onEsriBaseLayerChange($event)"
            v-on:mapReady="onEsriMapReady($event)">
        </EVueEsrimap>
	</div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import HelloWorld from './components/HelloWorld.vue';

    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class App extends Vue {
googleMapComponent: any;
googleMap: any;
tdtMapComponent: any;
tdtMap: any;
esriMapComponent: any;
esriMap: any;
mapUrl: string = 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer';
geoUrl: string = 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer';
gisApiUrl: string = 'http://js.arcgis.com/3.23/';
esriCSSUrl: string = 'http://js.arcgis.com/3.23/esri/css/esri.css';
initExtent: any = {xmax: 116.39029888900006, xmin: 116.04209077900009, ymax: 40.161018230000025, ymin: 39.885287565000056};
initExtent2: any = {xmax: 12980277.986602597, xmin: 12934415.769631553, ymax: 4864627.423165954, ymin: 4841696.314680432};

/**
 * 谷歌地图加载完成
 * @param $event
 */
onGoogleMapReady($event: any) {
    this.googleMapComponent = $event;
    this.googleMap = this.googleMapComponent.map;
}

/**
 * 谷歌底图切换
 * @param {number} $event
 */
onGoogleBaseLayerChange($event: number) {
    console.log($event);
}

/**
 * 天地图地图加载完成
 * @param $event
 */
onTdtMapReady($event: any) {
    this.tdtMapComponent = $event;
    this.tdtMap = this.tdtMapComponent.map;
    this.tdtMapComponent.setExtent(this.initExtent);
}

/**
 * 天地图底图切换
 * @param {number} $event
 */
onTdtBaseLayerChange($event: number) {
    console.log($event);
}

/**
 * esri地图加载完成
 * @param $event
 */
onEsriMapReady($event: any) {
    this.esriMapComponent = $event;
    this.esriMap = this.esriMapComponent.map;
}

/**
 * esri底图切换
 * @param {number} $event
 */
onEsriBaseLayerChange($event: number) {
    console.log($event);
}
    }
</script>

<style lang="scss">
	html,body {
		height: 100%;
		width: 100%;
		// overflow: hidden;
	}
	#app {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
	}
</style>
