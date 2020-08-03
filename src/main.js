
import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import VCharts from 'v-charts'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// Vue.use(VCharts)
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

Vue.prototype.axios = axios.create({
    baseURL: 'http://ali-stock.showapi.com',//测试接口地址
    // baseURL: 'http://7788xhp.com',//测试接口地址2
    headers:{
        "Authorization":"APPCODE 76378f20e71f45b9829512c803e371d8"
    },

     transformRequest: [function(data) {
          var qs = require('qs');
          //return data;
          return qs.stringify(data);
     }],
     transformResponse:[function(data) {
          return data;
     }],
     // headers: {
     //  'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
     // },
     params: {


     },
     timeout: 20000,
     responseType: 'json', // default
});
Vue.prototype.axios.interceptors.request.use(function(config){
    return config;
},function(error){
    return Promise.reject(error);
});

Vue.prototype.axios.interceptors.response.use(function(response){
    if(response.status==200){
        return response.data;
    }
    else{
        return response;
    }

},function(error){
    return Promise.reject(error);
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

