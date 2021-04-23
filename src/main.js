import Vue from 'vue'
import App from './App.vue'

import { Transfer, Tree, Checkbox } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Transfer)
Vue.use(Tree)
Vue.use(Checkbox)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
