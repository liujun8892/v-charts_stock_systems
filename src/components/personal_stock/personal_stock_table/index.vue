<template>
    <div class="personal_stock_table">
        <div class="tab_bar">
            <div :class="'tab_item'+ ' tab_item_'+(index+1)" v-for="(item,index) in tab_bar_list" :key="index"
                 @click="toggleTabBar(index)">{{item}}
                <div class="line" v-show="index===tab_bar_index"></div>
            </div>
        </div>
        <div class="stock_header">
            <div class="title">
                {{tab_bar_title}}({{stockColorList.length}})
                <i class="el-icon-arrow-down"></i>
            </div>
            <i class="el-icon-plus setting" @click="$router.push('/content')"></i>
        </div>
        <div class="stock_body">
            <div class="stock_item" v-for="(item,index) in stockColorList.slice(stock_start,stock_end)" :key="index">
                <div :class="{'stock_data':true,'stock_check_style':index===stock_check_index&&(isCreate||check_flag)}"
                     @click="toggleStockItem(index,item.code)">
                    <div class="stock_data_row_1">
                        <div class="stock_title">
                            {{item.name}}
                            <div class="R">
                                R
                            </div>
                        </div>
                        <div :class="{'current_price':true, 'price_color_red':item.diff_money>0,'price_color_green':item.diff_money<=0}">
                            {{item.nowPrice}}
                        </div>
                    </div>
                    <div class="stock_data_row_2">
                        <div class="stock_id">{{item.code}}</div>
                        <div :class="{'stock_up_down':true,'price_color_red':item.diff_money>0,'price_color_green':item.diff_money<=0}">
                            <span>{{item.diff_money>0?'+':''}}</span>
                            <span>{{item.diff_money}}</span>
                        </div>
                        <div :class="{'stock_up_down_percent':true,'price_color_red':item.diff_rate>0,'price_color_green':item.diff_rate<=0  }">
                            <span>{{item.diff_rate>0?'+':''}}</span>
                            <span>{{item.diff_rate}}%</span>
                        </div>
                    </div>
                </div>
                <div :class="'stock_color'+' stock_color_'+item.color_state "></div>
            </div>
        </div>
        <div class="pagination">
            <el-pagination
                    small="small"
                    background
                    layout="prev, pager, next"
                    :total="stockColorList.length"
                    :current-page="current_page"
                    @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            stockList: {
                type: Array
            },
            check_index: {
                type: Number
            }
        },
        created() {
            if (this.$route.query && this.$route.query.code) {
                this.current_page = Math.ceil((this.check_index+1) / this.page_size)
                console.log(this.current_page)
                this.stock_check_index = this.check_index % this.page_size
                this.check_flag =true
                this.handleCurrentChange(this.current_page)
            }

        },
        mounted() {

        },
        data() {
            return {
                tab_bar_list: ['自选股', '预警1', '预警2', '买点股'],
                tab_bar_index: 0,
                tab_bar_title: '自选股',
                stockColorList: this.stockList,
                page_size: 12,
                stock_start: 0,
                stock_end: 12,
                current_page: 1,
                stock_check_index: this.check_index,
                check_flag: false,
                isCreate: true,
                markLine:{
                    symbol: 'none',
                    data: [
                        {
                            yAxis: 15,
                            label:{
                                show: 'true',
                                position: 'middle',
                                formatter: 'S线',
                                color: 'green',
                                fontSize: 20
                            },
                            lineStyle:{
                                color: 'green',
                                width: 5
                            }
                        },
                        {
                            yAxis: 65,
                            label:{
                                show: 'true',
                                position: 'middle',
                                formatter: '及格线',
                                color: 'red',
                                fontSize: 20
                            },
                            lineStyle:{
                                color: 'red',
                                width: 5
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            toggleStockItem(index, code) {
                this.stock_check_index = index
                this.isCreate = false
                this.check_flag = true
                this.$emit('toggleStock', code)
            },
            toggleTabBar(index) {
                this.tab_bar_index = index
                if (index === 0) {
                    this.stockColorList = this.stockList
                    this.tab_bar_title = '自选股'
                } else if (index === 1) {
                    this.stockColorList = this.stockList.filter(item => item.color_state === 2)
                    this.tab_bar_title = '预警1'
                } else if (index === 2) {
                    this.stockColorList = this.stockList.filter(item => item.color_state === 3)
                    this.tab_bar_title = '预警2'
                } else if (index === 3) {
                    this.stockColorList = this.stockList.filter(item => item.color_state === 4)
                    this.tab_bar_title = '买点股'
                }
            },
            handleCurrentChange(val) {
                this.stock_start = (val - 1) * this.page_size
                this.stock_end = val * this.page_size
                this.check_flag= false
            }
        }
    }
</script>

<style scoped>
    .personal_stock_table {
        background-color: #FFFEFF;
    }

    .personal_stock_table .tab_bar {
        display: flex;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        border: 1px solid #7F7F7F;
        border-left: none;
    }

    .personal_stock_table .tab_bar .tab_item {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .personal_stock_table .tab_bar .tab_item .line {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: rgba(0, 0, 0, .5);

    }

    .tab_item_1 {
        color: #02A7F0;
    }

    .tab_item_2 {
        color: #FFFF52;
    }

    .tab_item_3 {
        color: #F59A23;
    }

    .tab_item_4 {
        color: #A3F255;
    }

    .setting {
        cursor: pointer;
    }

    .stock_header {
        display: flex;
        width: 100%;
        height: 42px;
        background-color: #F5F8FA;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 5px;
    }

    .stock_header .title {
        display: flex;
        align-items: center;
    }

    .stock_header .title i {
        margin-left: 3px;
    }

    .stock_body {
        width: 100%;
        height: 650px;
    }

    .stock_body .stock_item {
        display: flex;
        padding-left: 8px;
        width: 100%;
        height: 53px;
        border-bottom: 1px solid #F3F1F2;
        box-sizing: border-box;

    }

    .stock_body .stock_item .stock_data {
        flex: 1;
        cursor: pointer;
    }

    .stock_body .stock_item .stock_color {
        width: 10px;
        height: 100%;
    }

    .stock_color_1 {
        background-color: #00FFFF;
    }

    .stock_color_2 {
        background-color: #FFFF00;
    }

    .stock_color_3 {
        background-color: #F59A23;
    }

    .stock_color_4 {
        background-color: #95F204;
    }

    .stock_data .stock_data_row_1 {
        display: flex;
        width: 100%;
        height: 30px;
        justify-content: space-between;
        align-items: center;
    }

    .stock_data .stock_data_row_1 .stock_title {
        display: flex;
        align-items: center;
        color: #2B5EA9;
    }

    .stock_data_row_1 .stock_title .R {
        display: none;
        margin-left: 12px;
        padding: 0 2px;
        line-height: 20px;
        font-size: 12px;
        color: #3A393A;
        background-color: #EDEFF4;
        border-radius: 3px;
    }

    .stock_data_row_1 .stock_title .R.R_show {
        display: block;
    }

    .price_color_red {
        font-weight: 700;
        color: #DE2B2D;
    }

    .price_color_green {
        font-weight: 700;
        color: #58F50B;
    }

    .stock_data .stock_data_row_2 {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 22px;
    }

    .stock_data .stock_data_row_2 .stock_up_down {
        position: absolute;
        left: 46%;
    }

    .pagination {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .stock_check_style {
        background-color: rgba(0, 0, 0, .08);
    }
</style>