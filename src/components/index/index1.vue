<template>
  <div class="content">
    <div class="layout" @click="$emit('closeView',false)"></div>

    <div class="chartView">
      <div class="title">{{legendName}}
      <el-button
          :type="lineBole | filterColor"
          size='mini'
          @click="tohua"
          v-if='idx=="one"'
        >画线</el-button>
      </div>
      <div class="col">
        <!-- <el-button
          :type="filterVal('fen')"
        @click="setView('fen')">分</el-button>-->
        <el-button
          v-for="(item,index) in timeArr"
          :key="index"
          :type="index | filterVal(idx)"
          @click="setView(index)"
        >{{item}}</el-button>
        <el-button
          v-for="(item,index) in operationList"
          :key="index"
          :type="index | filterVal(idx)"
          @click="setView(index)"
        >{{item.name}}</el-button>
      </div>
      <div class="map">
        <div @mousedown='mousedown1' @mousemove='mousemove1' @mouseup='mouseup1' class="lineCon" v-if='!bole'>
          <ve-line :data="linmData" 
          
            width="1060px"
            height="400px"
            
            :settings="lineSetting"
            :mark-line = 'markLine'
            :data-zoom='dataZoom'
            :events="chartEvents"
            
          ></ve-line>
        </div>
        
        <ve-histogram :data="histogramData" width="1060px"
        :data-zoom='dataZoom'
          height="360px" v-if='!bole'></ve-histogram>
        <ve-candle
          :data="chartData"
          :settings="chartSettings"
          class="charts"
          width="1060px"
          height="760px"
          v-if='bole'
        ></ve-candle>
      </div>
    </div>
  </div>
</template>
<script>
var DateUtil = {
  /**
   * 当前时间，格式 yyyy-MM-dd HH:mm:ss
   *
   * @return 当前时间的标准形式字符串
   */
  now: function() {
    return new Date().format("yyyy-MM-dd HH:mm:ss");
  },
  /**
   * 格式化日期时间
   * 格式 yyyy-MM-dd HH:mm:ss
   *
   * @param date 被格式化的日期
   * @param format 格式化 参考 {@link date_formate}
   * @return 格式化后的日期
   */
  formatDateTime: function(date, format) {
    if (format == undefined || format == null) {
      format = "yyyy-MM-dd HH:mm:ss";
    }

    return date.format(format);
  },
  /**
   * 只支持毫秒级别时间戳，如果需要秒级别时间戳，请自行×1000
   *
   * @param timestamp 时间戳
   * @return 时间对象
   */
  date: function(timestamp) {
    return new Date(timestamp);
  }
};

/** 日期格式 命名参考hutool工具类 */
let date_formate = {
  /** 标准日期格式：yyyy-MM-dd */
  normDatePattern: "yyyy-MM-dd",
  /** 标准时间格式：hh:mm:ss */
  normTimePattern: "HH:mm:ss",
  /** 标准日期时间格式，精确到分：yyyy-MM-dd HH:mm */
  normDatetimeMinutePattern: "yyyy-MM-dd HH:mm",
  /** 标准日期时间格式，精确到秒：yyyy-MM-dd HH:mm:ss */
  normDatetimePattern: "yyyy-MM-dd HH:mm:ss",
  /** 标准日期时间格式，精确到毫秒：yyyy-MM-dd HH:mm:ss.SSS */
  normDatetimeMsPattern: "yyyy-MM-dd HH:mm:ss.SSS",
  /** 标准日期格式：yyyy年MM月dd日 */
  chineseDatePattern: "yyyy年MM月dd日",
  /** 标准日期格式：yyyyMMdd */
  pureDatePattern: "yyyyMMdd",
  /** 标准日期格式：HHmmss */
  pureTimePattern: "HHmmss",
  /** 标准日期格式：yyyyMMddHHmmss */
  pureDatetimePattern: "yyyyMMddHHmmss",
  /** 标准日期格式：yyyyMMddHHmmssSSS */
  pureDatetimeMsPattern: "yyyyMMddHHmmssSSS"
};

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
function getOffsetX(event){
      var evt =event||window.event;
      var srcObj = evt.target || evt.srcElement;
      if (evt.offsetX){
          return evt.offsetX;
      }else{
          var rect = srcObj.getBoundingClientRect();
          var clientx = evt.clientX;
          return clientx - rect.left;
      }
  }
  function getOffsetY(event){
      var evt =event||window.event;
      var srcObj = evt.target || evt.srcElement;
      if (evt.offsetY){
          return evt.offsetY;
      }else{
          var rect = srcObj.getBoundingClientRect();
          var clientY = evt.clientY;
          return clientY - rect.left;
      }
  }

import Vecandle from "v-charts/lib/candle.common.js";
import Veline from "v-charts/lib/line.common.js";
import Vehistogram from "v-charts/lib/histogram.common.js";
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markLine'
import { stringify } from "querystring";
export default {
  components: {
    "ve-candle": Vecandle,
    // eslint-disable-next-line vue/no-unused-components
    "ve-line": Veline,
    "ve-histogram":Vehistogram,
  },
  props: {},
  filters: {
    filterVal(val, pri) {
      // console.log(val, pri);
      if (val == pri) {
        return "primary";
      } else {
        return "";
      }
    },
    filterColor(val){
      if(val){
        return "primary";
      }
      else{
         return "";
      }
    }
  },
  data() {
    this.chartEvents = {
        click: function (e) {
          // self.name = e.name
          
        }
      }
    this.dataZoom = [
        {
          type: 'slider',
          start: 50,
          end: 100
        }
      ]
    return {
      idx: 0,
      msg:{},
      bole:true,
      markLine : {
        symbol:'none',
        lineStyle: {
            normal: {
                type: 'solid',
                color:'#000',
            }
        },
        data : [
           
        ]
      },
      timeArr:{
        one:'1分',
        two:'5分',
        three:'10分',
        four:'30分',
      },
      operationList: [
        {
          name: "日线",
          beginDay: "20180101",
          time: "day",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              日线: "日线"
            },
            showDataZoom: true
          }
        },
        {
          name: "2日线",
          beginDay: "20180101",
          time: "day",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              "2日线": "2日线"
            },
            showDataZoom: true
          }
        },
        {
          name: "5日线",
          beginDay: "20180101",
          time: "day",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              "5日线": "5日线"
            },
            showDataZoom: true
          }
        },
        {
          name: "10日线",
          beginDay: "20180101",
          time: "day",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              "10日线": "10日线"
            },
            showDataZoom: true
          }
        },
        {
          name: "25日线",
          beginDay: "20180101",
          time: "day",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              "25日线": "25日线"
            },
            showDataZoom: true
          }
        }
      ],
      lineSetting: {
            
          },
      code: "",
      legendName: "",
      beginDay: "20190101",
      time: "day",
      chartSettings: {
        showMA: true,
        showVol: true,
        labelMap: {
          MA5: "MA5"
        },
        legendName: {
          K线: "K线"
        },
        showDataZoom: true
      },
      histogramData:{
        columns: [],
        rows: []
      },
      lineData:[],
      lineBole:false,
      linmData:{
        columns: [],
        rows: []
      },
      chartData: {
        columns: [],
        rows: []
      }
    };
  },
  methods: {
    mousedown1(e){
      // console.log({x:getOffsetX(e),y:getOffsetY(e)},{x:getOffsetX(e),y:getOffsetY(e)})
      if(this.lineBole){
        this.lineData = [{x:getOffsetX(e),y:getOffsetY(e)},{x:getOffsetX(e),y:getOffsetY(e)}]
      }
      
    },
    mousemove1(e){
      console.log(this.lineBole)
      if(this.lineBole){
        console.log(this.lineBole,33)
        if(this.lineData.length!=0){
           this.lineData[1] = {x:getOffsetX(e),y:getOffsetY(e)}
           this.markLine = {
            symbol:'none',
            lineStyle: {
                normal: {
                    type: 'solid',
                    color:'#000',
                }
            },
            data : [
               this.lineData
            ]
          }
        }
     }
    },
    mouseup1(e){
      this.lineBole = false;
      if(this.lineData.length!=0){
        this.lineData[1] = {x:getOffsetX(e),y:getOffsetY(e)}
        localStorage.setItem('codeArr2'+this.code,JSON.stringify(this.lineData));
        this.markLine = {
          symbol:'none',
          lineStyle: {
              normal: {
                  type: 'solid',
                  color:'#000',
              }
          },
          data : [
             this.lineData
          ]
        }
        let codeArr2 = localStorage.getItem('codeArr2')?JSON.parse(localStorage.getItem('codeArr2')):[];
        codeArr2.unshift(this.msg);
        localStorage.setItem('codeArr2',JSON.stringify(codeArr2));
      }
    },
    filterVal(val) {
      if (val == this.idx) {
        return "primary";
      }
    },
    setIdx(code,msg) {
      this.idx = 0;
      this.beginDay = "20190101";
      this.time = "day";
      this.msg = msg;
      this.bole = true;
      this.lineData = localStorage.getItem('codeArr2'+code)?JSON.parse(localStorage.getItem('codeArr2'+code)):[];
      this.markLine = {
        symbol:'none',
          lineStyle: {
              normal: {
                  type: 'solid',
                  color:'#000',
              }
          },
          data : [
             
          ]
      }
    },
    setView(idx) {
      // this.idx = idx;

      // this.legendName = this.operationList[idx].legendName;

      if (idx == "one" || idx == "two" || idx == "three" || idx == "four") {
        this.timeInit(idx);
      } else {
        this.time = this.operationList[idx].time;
        this.beginDay = this.operationList[idx].beginDay;
        this.init(
          this.code,
          this.legendName,                                                                                                                            
          idx,
          this.operationList[idx].legendName
        );
      }
    },
    tohua(){
      this.lineData = [];
      this.markLine = {
        symbol:'none',
          lineStyle: {
              normal: {
                  type: 'solid',
                  color:'#000',
              }
          },
          data : [
             
          ]
      }
      this.lineBole = true;
    },
    timeInit(idx) {
      let that = this;
      this.axios({
        method: "get",
        url: "/timeline",
        params: {
          day: 5,
          code: that.code
        }
      })
        .then(
          res => {
            let dataList = res.showapi_res_body.dataList;
            let dataArr = [];
            // eslint-disable-next-line no-empty
            for(let j=0;j<dataList.length;j++){
              for(let k=0;k<dataList[j].minuteList.length;k++){
                dataList[j].minuteList[k].time = dataList[j].date + ' ' +dataList[j].minuteList[k].time;
                dataArr.push(dataList[j].minuteList[k])
              }
            }
            if (idx) {
              this.idx = idx;
            }
           if(idx=='one'&&this.lineData.length!=0){
              this.markLine = {
                symbol:'none',
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color:'#000',
                    }
                },
                data : [
                   this.lineData
                ]
              }
            }
            else{
              this.markLine = {
                symbol:'none',
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color:'#000',
                    }
                },
                data : [
                   
                ]
              }
            
            }
            let tmp = 1;
            switch (idx) {
              case 'one':
                tmp = 1;
                break;
              case 'two':
                tmp = 5;
                break;
              case 'three':
                tmp = 10;
                break;
              case 'four':
                tmp = 30;
                break;
            }
            let listArr = [];
            for (let i = dataArr.length - 1; i > 0; i--) {
              if (i % tmp == 0 || i == dataArr.length - 1) {
                listArr.unshift(dataArr[i]);
              }
            }
            let arr = [];
            let histogramArr = [];
            let min = listArr[0].nowPrice;
            let max = 0;
            for (let i = listArr.length - 1; i > 0; i--) {
              let obj = {};
              obj.時間 = listArr[i].time;
              obj.均价 = listArr[i].avgPrice;
              // obj.交易量 = listArr[i].volume;
              obj.当前价 = listArr[i].nowPrice;
              if(min>listArr[i].nowPrice){
                min = listArr[i].nowPrice
              }
              if(max<listArr[i].nowPrice){
                max = listArr[i].nowPrice
              }
              arr.push(obj);
              histogramArr.push({"時間":listArr[i].time,"交易量":listArr[i].volume})
            }
            this.lineSetting = {
              max:max,
              min:min
            }
            this.linmData = {
              columns: [
                "時間",
                // "交易量",
                // "均价",
                "当前价",
              ],
              rows: arr,
             
            };
            this.histogramData = {
              columns: [
                "時間",
                "交易量",
              ],
              rows: histogramArr
            }
            
            this.bole = false;

          },
          ret => {
            this.$message({
              message: "此股票不支持分k线",
              type: "danger"
            });
          }
        )
        .catch(error => {
        });
    },
    init(code, name, idx, legendName) {
      this.code = code;
      this.legendName = name;
      let that = this;
      this.axios({
        method: "get",
        url: "/realtime-k",
        params: {
          beginDay: this.beginDay,
          code: that.code,
          time: this.time
        }
      })
        .then(
          res => {
            let list = res.showapi_res_body.dataList;
            if (idx || idx === 0) {
              this.idx = idx;
            }
            this.bole = true;
            let tmp = 1;
            switch (idx) {
              case 0:
                tmp = 1;
                break;
              case 1:
                tmp = 2;
                break;
              case 2:
                tmp = 5;
                break;
              case 3:
                tmp = 10;
                break;
              case 4:
                tmp = 25;
                break;
            }
            let listArr = [];
            for (let i = list.length - 1; i > 0; i--) {
              if (i % tmp == 0 || i == list.length - 1) {
                listArr.unshift(list[i]);
              }
            }
            //  this.chartSettings = this.operationList[idx].chartSettings
            let arr = [];
            for (let i = listArr.length - 1; i > 0; i--) {
              let obj = {};
              obj.日期 = listArr[i].time;
              obj.开盘价 = listArr[i].open;
              obj.结束价 = listArr[i].close;
              obj.最高价 = listArr[i].max;
              obj.最低价 = listArr[i].min;
              obj.成交数 = listArr[i].volumn;
              arr.push(obj);
            }
            this.chartData = {
              columns: [
                "日期",
                "开盘价",
                "结束价",
                "最高价",
                "最低价",
                "成交数"
              ],
              rows: arr
            };
          },
          ret => {
            this.$message({
              message: "此股票不支持" + this.operationList[idx].name,
              type: "danger"
            });
          }
        )
        .catch(error => {
          // console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.content {
  position: absolute;
  width: 1600px;
  height: 900px;
  top: 0;
  right: 0;
  z-index: 2000;
  /* background: #fff; */
}
.layout {
  position: absolute;
  width: 1600px;
  height: 900px;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
}
.chartView {
  background: #fff;
  position: absolute;
  z-index: 2001;
  width: 1100px;
  height: 900px;
  right: 0;
  top: 0;
}
.chartView > .title {
  line-height: 40px;
  padding-left: 20px;
}
.chartView > .title button{
  float: right;
  margin-top: 10px;
  margin-right: 10px;
}
.chartView > .col {
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
}
.chartView > .map {
  width: 1060px;
  height: 760px;
  padding: 20px;
}
.lineCon{
  width: 1060px;
  height: 460px;
}
</style>