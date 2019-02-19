<template>
	<div id="app">
		<EVueTest :testValue="msg"></EVueTest>
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
    }
</script>

<style lang="scss">
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2C3E50;
		margin-top: 60px;
	}
</style>
