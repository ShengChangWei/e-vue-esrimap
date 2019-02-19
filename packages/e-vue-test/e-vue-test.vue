<template>
	<div>
		{{testValue}}
	</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({
        name: 'EVueTest',
        componentName: 'EVueTest'
    })
    export default class EVueTest extends Vue {
        @Prop({default: '大家好'}) testValue: string;
    }

</script>

<style scoped lang="scss">

</style>