<template>
  <div class="content">
    <div class="layout" @click="$emit('closeView',false)"></div>

    <div class="chartView">
      <div class="title">{{legendName}}
      <el-button
          :type="lineBole | filterColor"
          size='mini'
          @click="tohua"
          v-if='!lineBole'
        >画线</el-button>
         <el-button
         v-if='lineBole'
          :type="!lineBole | filterColor"
          size='mini'
          @click="endHua"
        >结束画线</el-button>
      </div>
     
      
      <div class="col">
        <!-- <el-button
          :type="filterVal('fen')"
        @click="setView('fen')">分</el-button>-->

        <el-button
          v-for="(item,index) in operationList"
          :key="index"
          :type="index | filterVal(idx)"
          @click="setView(index)"
        >{{item.name}}</el-button>
      </div>
      <div class="map" >
        <ve-candle
          :data="chartData"
          ref='echart'
          :events="chartEvents"
          :set-option-opts = false
          :settings="chartSettings"
          :mark-line = 'markLine'
          class="charts"
          width="1260px"
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

import  Vecandle from "v-charts/lib/candle.common.js";
import Veline from "v-charts/lib/line.common.js";
import Vehistogram from "v-charts/lib/histogram.common.js";
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markLine'
import { stringify } from "querystring";
export default {
  components: {
    "ve-candle": Vecandle,
    // eslint-disable-next-line vue/no-unused-components

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
        mousedown: function (e) {
          // self.name = e.name
          console.log(e)
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
      dataArr:[],
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
      operationList: [
        {
          name: "5分线",
          beginDay: "20180101",
          time: "5",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              日线: "5分线"
            },
            showDataZoom: true,
            start:0,
            end: 100
          }
        },
        {
          name: "30分线",
          beginDay: "20180101",
          time: "30",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              日线: "30分线"
            },
            showDataZoom: true,
            start:0,
            end: 100
          }
        },
        {
          name: "60分线",
          beginDay: "20180101",
          time: "60",
          chartSettings: {
            showMA: true,
            showVol: true,
            labelMap: {
              MA5: "MA5"
            },
            legendName: {
              日线: "60分线"
            },
            showDataZoom: true,
            start:0,
            end: 100
          }
        },
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
            showDataZoom: true,
            start:0,
            end: 100
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
            showDataZoom: true,
            start:0,
            end: 100
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
            showDataZoom: true,
            start:0,
            end: 100
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
            showDataZoom: true,
            start:0,
            end: 100
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
            showDataZoom: true,
            start:0,
            end: 100
          }
        }
      ],
      lineSetting: {
            
          },
      code: "",
      legendName: "",
      beginDay: "20180101",
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
        showDataZoom: true,
        start:80,
        end: 100
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
      },
      
    };
  },
  mounted(){

    // this.$refs['echart'].on('mousedown',(params)=>{
    //       console.log(params)
    //     })
  },
  methods: {

    mousedown1(e){
      // console.log({x:getOffsetX(e),y:getOffsetY(e)},{x:getOffsetX(e),y:getOffsetY(e)})
      if(this.lineBole){
        this.lineData = [{x:getOffsetX(e),y:getOffsetY(e)},{x:getOffsetX(e),y:getOffsetY(e)}]
      }
      else{
        this.lineData = []
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
      console.log(333)
      this.lineBole = false;
      if(this.lineData.length!=0){
        this.lineData[1] = {x:getOffsetX(e),y:getOffsetY(e)}
        localStorage.setItem('codeArr1'+this.code,JSON.stringify(this.lineData));
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
        let codeArr1 = localStorage.getItem('codeArr1')?JSON.parse(localStorage.getItem('codeArr1')):[];
        codeArr1.unshift(this.msg);
        localStorage.setItem('codeArr1',JSON.stringify(codeArr1));
      }
    },
    filterVal(val) {
      if (val == this.idx) {
        return "primary";
      }
    },
    setIdx(code,msg) {

      this.idx = 3;
      this.beginDay = "20180101";
      this.time = "day";
      this.msg = msg;
      this.bole = true;
      this.lineData = localStorage.getItem('codeArr1'+code)?JSON.parse(localStorage.getItem('codeArr1'+code)):[];
      this.markLine = {
        symbol:'none',
          lineStyle: {
              normal: {
                  type: 'solid',
                  color:'#000',
              }
          },
          data : []
      }
    },
    setView(idx) {
      // this.idx = idx;
      this.lineBole = false;
      this.idx = idx;
      this.markLine = {
              symbol:'none',
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color:'#000',
                    }
                },
                data : []
            }
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
      // this.lineData = [];
      // this.markLine = {
      //   symbol:'none',
      //     lineStyle: {
      //         normal: {
      //             type: 'solid',
      //             color:'#000',
      //         }
      //     },
      //     data : [
             
      //     ]
      // }
      this.markLine = {
              symbol:'true',
          lineStyle: {
              normal: {
                width:1,
                  type: 'solid',
                  color:'#000',
              }
          },
          smooth: true,
            symbolSize: 20,
          data : [[{
                yAxis:this.dataArr[10].开盘价,
                xAxis:10
          },{
                yAxis:this.dataArr[this.dataArr.length-20].开盘价,
                xAxis:this.dataArr.length-20
          }]]
      }
      localStorage.setItem('codeArr1'+this.code+'_'+this.idx,JSON.stringify([{
                yAxis:this.dataArr[10].开盘价,
                name:this.dataArr[10].日期,
                xAxis:10
          },{
                yAxis:this.dataArr[this.dataArr.length-20].开盘价,
                name:this.dataArr[this.dataArr.length-20].日期,
                xAxis:this.dataArr.length-20
          }]));
      this.lineBole = true;
    },
    endHua(){
       this.init(this.code,this.legendName,this.idx)
            this.lineBole = false;
    },
    init(code, name, idx) {
      this.code = code;
      this.legendName = name;
      this.bole = false
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
             // this.$refs['echart'].clean();
            let list = res.showapi_res_body.dataList;
            if (idx || idx === 0) {
              this.idx = idx;
            }
            let tmp = 1;
            switch (idx) {
              case 3:
                tmp = 1;
                break;
              case 4:
                tmp = 2;
                break;
              case 5:
                tmp = 5;
                break;
              case 6:
                tmp = 10;
                break;
              case 7:
                tmp = 25;
                break;
                default:
                tmp = 1;

            }

            let listArr = [];
            for (let i = list.length - 1; i > 0; i--) {
              if (i % tmp == 0 || i == list.length - 1) {
                listArr.unshift(list[i]);
              }
            }
             this.chartSettings = this.operationList[idx].chartSettings;

            let arr = [];

            for (let i = listArr.length - 1; i > 0; i--) {
              let obj = {};
              obj.index = listArr.length-i;
              obj.日期 = listArr[i].time;
              obj.开盘价 = listArr[i].open;
              obj.结束价 = listArr[i].close;
              obj.最高价 = listArr[i].max;
              obj.最低价 = listArr[i].min;
              obj.成交数 = listArr[i].volumn;
              arr.push(obj);
            }

            // this.$refs['echart'].xData =[];
            // this.$refs['echart'].yData =[];
            this.dataArr = arr;
            this.bole = true;
            this.chartData = {
              columns: [
                  "index",
         
                "开盘价",
                "结束价",
                "最高价",
                "最低价",
                "成交数",
                       "日期",
              ],
              rows: arr,
              
            };
            // let lineArr = [];
            // for(let k =1;k<arr.length-100;k++){
            //   console
            //     lineArr.push({
            //           yAxis:12,
            //           xAxis:k
            //     })
            // }
            // console.log(lineArr)
            let obj = localStorage.getItem('codeArr1'+code+'_'+idx)?JSON.parse(localStorage.getItem('codeArr1'+code+'_'+idx)):[];
            if(obj.length>1){
              
              let startval = 0;
              let endval = 0;
              for (let index =0 ;index <arr.length ; index++) {
                if(obj[0].name == arr[index].日期){
                  startval = index
                }
                if(obj[1].name ==arr[index].日期){
                  endval = index
                }
              }
              console.log(startval,endval)
              let val = endval-startval;
              let yAxis1,yAxis2;
              let deep  = 0;
              if(obj[1].yAxis>=obj[0].yAxis){
                deep = (obj[1].yAxis-obj[0].yAxis)/val;
                 yAxis1 = obj[1].yAxis+(arr.length-1-endval)*deep;
                 yAxis2 = obj[0].yAxis-startval*deep;
              }
              else{
                deep = -(obj[1].yAxis-obj[0].yAxis)/val;
                yAxis1 = obj[1].yAxis-(arr.length-1-endval)*deep;

                yAxis2 = Number(obj[0].yAxis)+Number(startval*deep);
              }
              this.markLine = {
                    symbol:'false',
                    lineStyle: {
                        normal: {
                          width:1,
                            type: 'solid',
                            color:'#000',
                        }
                    },
                    smooth: true,
                      symbolSize: 0,
                    data : [[{
                          yAxis:yAxis2,
                          xAxis:0
                    },{
                          yAxis:yAxis1,
                          xAxis:arr.length-1
                    }]]
                
                }
            }
            else{

              
            
            // this.$refs['echart'].setOption(this.chartData,true)
            }
//             setTimeout(function () {
//     // Add shadow circles (which is not visible) to enable drag.
//     let myChart = this.$refs['echart']

//     myChart.setOption({
//         graphic: echarts.util.map(data, function (item, dataIndex) {
//             return {
//                 type: 'circle',
//                 position: myChart.convertToPixel('grid', item),
//                 shape: {
//                     cx: 0,
//                     cy: 0,
//                     r: 10
//                 },
//                 invisible: true,
//                 draggable: true,
//                 ondrag: echarts.util.curry((dataIndex, dx, dy) =>{
//     data[dataIndex] = myChart.convertFromPixel('grid', this.position);

//     // Update data
//     myChart.setOption({
//         series: [{
//             id: 'a',
//             data: data
//         }]
//     });
// }, dataIndex),
//                 onmousemove: echarts.util.curry((dataIndex)=> {
//     myChart.dispatchAction({
//         type: 'showTip',
//         seriesIndex: 0,
//         dataIndex: dataIndex
//     });
// }, dataIndex),
//                 onmouseout: echarts.util.curry((dataIndex)=> {
//     myChart.dispatchAction({
//         type: 'hideTip'
//     });
// }, dataIndex),
//                 z: 100
//             };
//         })
//     });
// }, 0);
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
  width: 1300px;
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
  width: 1260px;
  height: 760px;
  padding: 20px;
}
.lineCon{
  width: 1260px;
  height: 460px;
}
</style>