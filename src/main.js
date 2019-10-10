import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import request from './util/request'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.prototype.$event = new Vue()
Vue.prototype.$http = request

export default new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
