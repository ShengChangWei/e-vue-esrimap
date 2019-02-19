import EVueTest from './e-vue-test/e-vue-test';

const components = [
    EVueTest
];

const install = function (Vue) {
    if (install['installed']) return;
    components.map(component => Vue.component(component.name, component))
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    EVueTest
}