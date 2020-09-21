<template>
    <div class="page" ref="page">
        <!--左侧股票表格组件-->
        <personal-stock-table class="f_3" :stockList="stockList" @toggleStock="toggleStock"
                              :check_index="check_stock_index"></personal-stock-table>

        <div class="personal_stock_graph">
            <div class="header">
                <div class="title">{{check_stock_name}}</div>
                <i class="el-icon-edit-outline graph_icon" @click="graphHandle"></i>
            </div>
            <div class="time_area">
                <div class="title">分时</div>
                <div :class="{'btn':true,'btn_checked':index===btn_index}" v-for="(item,index) in timeList" :key="index" @click="toggleTime(index)">
                    {{item.name}}
                </div>
            </div>
            <div class="mask" ref="mask">
                <canvas id="myCanvas" width="800px" height="500px" >
                    您的浏览器不支持canvas，请升级浏览器
                </canvas>

            </div>
            <ve-candle :data="chartData" :settings="chartSettings" ></ve-candle>
        </div>
    </div>
</template>

<script>
    import personalStockTable from '../../components/personal_stock/personal_stock_table'
    import veCandle from 'v-charts/lib/candle.common'
    import {stock_item, time_k, time_k_part} from '../../api/request'

    export default {
        name: "index",
        data() {
            this.chartSettings = {
                showMA: true,
                showVol: true,
                labelMap: {
                    open: '开盘价',
                    close: '收盘价',
                    max: '日最高价',
                    min: '日最低价',
                    volumn: '成交量'
                },
                legendName: {
                    '日K': 'day k'
                },
                showDataZoom: true
            }
            // 本地储存的股票代码啊编号
            this.codeArr = []
            return {
                chartData: {
                    columns: ['time', 'open', 'close', 'max', 'min', 'volumn'],
                    rows: []
                },
                // 股票信息列表
                stockList: [],
                // 画线颜色状态 0 无 1 蓝色 2 黄色 3 橙色 4 绿色
                color_state: 0,
                // 当前选中股票的编号
                check_stock_code: '',
                // 当前选中股票的名称
                check_stock_name: '',
                // 当前选中的股票索引
                check_stock_index: 0,
                // 分时
                timeList: [{
                    name: '1分',
                    value: 1,
                    type: 'minutes'
                }, {
                    name: '2分',
                    value: 2,
                    type: 'minutes'
                }, {
                    name: '10分',
                    value: 10,
                    type: 'minutes'
                }, {
                    name: '50分',
                    value: 50,
                    type: 'minutes'
                }, {
                    name: '日线',
                    value: 1,
                    type: 'day'
                }, {
                    name: '2日线',
                    value: 2,
                    type: 'day'
                }, {
                    name: '5日线',
                    value: 5,
                    type: 'day'
                }, {
                    name: '10日线',
                    value: 10,
                    type: 'day'
                }, {
                    name: '25日线',
                    value: 25,
                    type: 'day'
                },
                    {
                        name: '2年趋势图',
                        value: 2,
                        type: 'year'
                    }
                ],
                btn_index: 9
            }
        },
        components: {
            personalStockTable,
            veCandle
        },
        created() {
            // 获取本地自选的股票编号
            this.codeArr = window.localStorage.getItem('codeArr') ? JSON.parse(window.localStorage.getItem('codeArr')) : []
            if (this.$route.query && this.$route.query.code) {
                this.check_stock_index = this.findStockIndexByCode(this.$route.query.code)
            }

            // 根据编号获取股票详情数据列表
            this.getStockList(this.codeArr)

            // setTimeout(() => {
            //         console.log(this.stockList)
            //     },
            //     2000)
        },
        methods: {
            // 根据股票编号获取k线
            toggleStock(code) {
                this.getStockKLine(code)
            },
            // 初始化自选股票列表
            async getStockList(codeArr) {
                for (let i = 0; i < codeArr.length; i++) {
                    await this.getStockByCode(codeArr[i].code)
                }
                this.getDefaultKLine()
            },
            // 根据股票编号获取股票详细信息
            async getStockByCode(code) {
                await stock_item(code).then(res => {
                    if (this.color_state === 5) {
                        this.color_state = 0
                    }
                    res.showapi_res_body.stockMarket.color_state = this.color_state
                    this.color_state++
                    this.stockList.push(res.showapi_res_body.stockMarket)
                })
            },
            getStockKLine(code) {
                time_k(code).then(res => {
                    res.showapi_res_body.dataList.reverse()
                    res.showapi_res_body.dataList.map(item => {
                        item.time = item.time.substr(0, 4) + '-' + item.time.substr(4, 2) + '-' + item.time.substr(6)
                        return item
                    })
                    this.chartData.rows = res.showapi_res_body.dataList
                    this.check_stock_code = res.showapi_res_body.code
                    this.check_stock_name = res.showapi_res_body.name
                    console.log(this.chartData.rows)
                })
            },
            // 获取默认的k线
            getDefaultKLine() {
                // 默认获取第一个自选股票的k线数据
                if (this.$route.query && this.$route.query.code) {
                    this.check_stock_code = this.$route.query.code
                } else if (this.stockList.length > 0) {
                    this.check_stock_code = this.stockList[0].code
                }
                this.getStockKLine(this.check_stock_code)
            },
            // 根据选中的股票编码获取所在的索引
            findStockIndexByCode(code) {
                let index = this.codeArr.findIndex(item => item.code === code)
                return index === -1 ? 0 : index
            },
            // 切换时间线
            toggleTime(index){
                this.btn_index = index
                // if (index===0){
                //     time_k_part('600660',1).then(res => {
                //         console.log(res)
                //         this.chartData.columns = ['time','nowPrice','avgPrice','volume']
                //         this.chartData.rows = res.showapi_res_body.dataList.minuteList
                //         this.chartSettings.labelMap = {}
                //     })
                // }
            },
            graphHandle(){
                // this.$refs['mask'].addEventListener('mousedown',()=>{
                //     console.log('start')
                // })
                // this.$refs['mask'].addEventListener('mouseover',()=>{
                //     console.log('move...')
                // })
                // this.$refs['mask'].addEventListener('mousedown',()=>{
                //     console.log('end...')
                // })
                this.getLine()
            },
            getLine(){
                var c=document.getElementById("myCanvas");

                var ctx=c.getContext("2d");

                ctx.moveTo(120,200);

                ctx.lineTo(1300,200);

                ctx.lineWidth=5;

                ctx.strokeStyle="red";

                ctx.stroke();
            }
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        display: flex;
    }

    .f_3 {
        flex: 3;
        display: flex;
        flex-direction: column;
    }

    .personal_stock_graph {
        flex: 9;
        box-sizing: border-box;
        padding: 10px 0 0 15px;
        background-color: #FFFEFF;
    }

    .personal_stock_graph .header {
        display: flex;
        width: 100%;
        height: 40px;
        font-size: 20px;
        align-items: center;
        font-weight: 700;
        padding-left: 30px;
        box-sizing: border-box;
    }

    .personal_stock_graph .header i {
        margin-left: 10px;
        transform: translateY(2px);
    }

    .personal_stock_graph .time_area {
        display: flex;
        align-items: center;
        height: 40px;
        border: 1px solid #7F7F7F;
        margin-left: 30px;
        margin-right: 80px;
        padding-left: 10px;
        box-sizing: border-box;
        margin-bottom: 20px;
    }

    .time_area .title {
        margin-right: 30px;
    }

    .time_area .btn {
        margin-left: 10px;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #FFF;
        border: 1px solid #DCDFE6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: .1s;
        font-weight: 500;
    }

    .time_area .btn:hover {
        border: 1px solid #87a2f3;
    }

    .btn_checked {
        border: 1px solid #87bbf3 !important;
    }

    .graph_icon {
        cursor: pointer;
    }

    .mask {
        position: absolute;
        width: 1028px;
        height: 400px;
        /*z-index: 999;*/
    }
</style>