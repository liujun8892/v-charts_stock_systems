import Vue from 'vue';
// 搜索接口
// /name-to-stockinfo
export function search(){
   return  Vue.prototype.axios({
        method: 'get',
        url: '/name-to-stockinfo',
        params: {
            code: '00700',
            name: '',
            pinyin: '',
        }
    }).then(res=>{
        return res;
    }).catch(err =>{
        // console.log(err)
    })
}

// 真实股票
// /real-stockinfo
export  function stock_item(code) {
   return  Vue.prototype.axios({
        method: 'get',
        url: '/real-stockinfo',
        params: {
            code: code,
            needIndex: 0,
            need_k_pic:0,
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        // console.log(err)
    })
}

// k线图
//realtime-k
export function time_k(code) {
  return   Vue.prototype.axios({
        method: "get",
        url: "/realtime-k",
        params: {
            beginDay: "20180101",
            code: code,
            time: "day"
        }
    }).then(res=>{
      return res;
    }).catch(err=>{
        console.log(err)
    })
}

// 日图
// timeline

export function time_k_part(code,day) {
   return  Vue.prototype.axios({
        method: "get",
        url: "/timeline",
        params: {
            day: day,
            code: code
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err)
    })
}


