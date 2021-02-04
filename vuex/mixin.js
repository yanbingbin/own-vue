export default function(Vue) {
    Vue.mixin({ 
        beforeCreate: VuexInit
    });

    function VuexInit() {
        const options = this.$options;
        if (options.$store) { // 说明是根实例，和vue-router 一样
            this.$store = options.$store; // 给根实例添加 $store 属性
        } else if (options.parent && options.parent.$store) { // 拿到父组件的$store
            this.$store = options.parent.$store; // 给子组件添加 $store 属性
        }
    }
}