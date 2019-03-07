<template>
	<div id="app">
		<EVueEsrimap
		:mapType="'tdt'"
		:mapUrl="['vec','cva']"
		:submapUrl="[['img','cia'], ['ter','cta']]"
		:geoUrl="geoUrl"
		:initExtent="initExtent"
		:gisApiUrl="gisApiUrl"
		></EVueEsrimap>
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
		private msg: string = '我是测试文件';
		initExtent: any = {xmax: 116.39029888900006, xmin: 116.04209077900009, ymax: 40.161018230000025, ymin: 39.885287565000056};
		gisApiUrl: string = 'https://js.arcgis.com/3.23/'
		geoUrl: string = 'https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'
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
	}
</style>
