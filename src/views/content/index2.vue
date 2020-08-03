<template>
  <div>
   <el-table
    :data="dataList"
    stripe
     
    style="width: 100%">
    <el-table-column
      prop="code"
      align= 'center'
      label="股票代码"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      align= 'center'
      label="股票名称"
      width='160'
    >
    </el-table-column>
    <el-table-column
      prop="nowPrice"
      label="当前价"
      align= 'center'
    >
    </el-table-column>
    <el-table-column
      prop="diff_money"
      label="涨跌额"
      align= 'center'
    >
    <template slot-scope="scope">
        <span :class="{'green':scope.row.diff_money>0}" v-if='scope.row.diff_money>=0'>+{{scope.row.diff_money}}</span>
        <span :class="{'red':scope.row.diff_money<0}" v-if='scope.row.diff_money<0'>{{scope.row.diff_money}}</span>
    </template>
    </el-table-column>
    <el-table-column
      prop="diff_rate"
      label="涨跌幅"
      align= 'center'
    >
    <template slot-scope="scope">
        <span :class="{'green':scope.row.diff_rate>0}" v-if='scope.row.diff_rate>=0'>+{{scope.row.diff_rate}}</span>
        <span :class="{'red':scope.row.diff_rate<0}" v-if='scope.row.diff_rate<0'>{{scope.row.diff_rate}}</span>
    </template>
    </el-table-column>
    <!-- <el-table-column
      prop="date"
      label="年初至今"
    >
    </el-table-column> -->
    <el-table-column
      prop="tradeNum"
      label="成交量"
      align= 'center'
    >
    </el-table-column>
    <el-table-column
      prop="tradeAmount"
      width='150'
     align= 'center'
      label="成交额(元)"
    >
    </el-table-column>
    <el-table-column
      prop="pe"
      label="市盈率"
      align= 'center'
    >
    </el-table-column>
    <!-- <el-table-column
      prop="date"
      label="股息率"
    >
    </el-table-column> -->
    <el-table-column
      prop="all_value"
      label="市值(亿元)"
      align= 'center'
    >
    </el-table-column>
    
    <el-table-column
      prop="date"
      label="周期备注"
      width='140'
      align= 'center'
    >
    <template slot-scope="scope">
        <el-input v-model="scope.row.dateRemark" placeholder="请输入内容" @input="setRemark(scope.$index,scope.row)"></el-input>
         
    </template>
    </el-table-column>
    <el-table-column
      prop="date"
      label="模式备注"
      width='140'
      align= 'center'
    >
    <template slot-scope="scope">
        <el-input v-model="scope.row.pattern" placeholder="请输入内容" @input="setPattern(scope.$index,scope.row)"></el-input>
    </template>
    </el-table-column>
    <el-table-column
      prop="date"
      label="操作"
      align= 'center'
      width='200'
    >
    <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="checkTpl(scope.$index, scope.row)">查看k线图</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
    </template>
    </el-table-column>
  </el-table>
  <tpl v-show='tplShow' :code='code' @closeView='tplShow=false' :legendName = 'legendName' ref="charts"></tpl>
  </div>

</template>

<style>

</style>

<script>
import { promises } from 'fs';
import tpl from '@/components/index/index2'

export default {
  components: {
   tpl:tpl
  },
  data () {


    return {
        input:'',
        bole:true,
        legendName:'',
        tplShow:false,
        code:'',
        list:[],
        dataList:[],
        msgList:[],
        timer:null
    }
  },
  destroyed(){
      if(this.timer){
        clearInterval(this.timer)
      }
    },
  created(){
      this.timer = setInterval(()=>{
          let bole = localStorage.getItem('bole')?true:false;
        //   console.log(localStorage.getItem('bole'),bole)
          if(localStorage.getItem('bole')=='true'){
            //   console.log(333)
              this.getList();
          }
          
      },10000)
       this.getList();
    },
    
    methods:{
        setRemark(index,scope){
          let list = localStorage.getItem('codeArr2') ? JSON.parse(localStorage.getItem('codeArr2')):[];
          list[index].dateRemark = scope.dateRemark;
          localStorage.setItem('codeArr2',JSON.stringify(list));

        },
        
        setPattern(index,scope){
          let list = localStorage.getItem('codeArr2') ? JSON.parse(localStorage.getItem('codeArr2')):[];
          list[index].pattern = scope.pattern;
          localStorage.setItem('codeArr2',JSON.stringify(list));

        },
        setVal(index,scope){
          let list = localStorage.getItem('codeArr2') ? JSON.parse(localStorage.getItem('codeArr2')):[];
          list[index].dateRemark = scope.dateRemark;
          localStorage.setItem('codeArr2',JSON.stringify(list));
          
        },
        checkTpl(index,scope){
            console.log(scope)
            this.code = scope.code;
            this.legendName = scope.name;
             this.$refs.charts.chartSettings={
          showMA: true,
          showVol: true,
          labelMap: {
              MA5: 'MA5',
            
          },
          legendName: {
            '日K': '日K'
          },
          showDataZoom: true
        }
         this.$refs.charts.chartData={
          columns: [],
          rows: [
            
            
          ]
        }
         this.$refs.charts.setIdx(scope.code,scope);
            this.tplShow = true;
            this.$refs.charts.init(scope.code,scope.name);
        },
        handleDelete(index,scope){
            this.$confirm('是否删除此条股票?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arr = JSON.parse(localStorage.getItem('codeArr2'));
                let idx = -1;
                for(let i=0;i<arr.length;i++){
                    if(arr[i].code == scope.code){
                        idx = i;
                        break;
                    }
                }
                // console.log({code:scope.code,name:scope.name},arr,arr.indexOf({code:scope.code,name:scope.name}))
                let newArr = arr.length>0 ? arr.splice(idx,1):[];
                // console.log(newArr,arr)
                localStorage.setItem('codeArr2',JSON.stringify(arr))
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.getList()();
            }).catch(() => {
                  
            });
        },
        async getList(){
            
            this.msgList = [];
            if(!this.bole){
                return false;
            }
            this.list = localStorage.getItem('codeArr2') ? JSON.parse(localStorage.getItem('codeArr2')):[];
           
            for( let i of this.list){
                this.bole = false;
                let val = await this.getMsg(i)
                
                
            }
            this.dataList = this.msgList;
            this.bole = true;
        },
        getMsg(val){
            return new Promise((resolve, reject)=>{
                this.axios({
                    method: 'get',
                    url: '/real-stockinfo',
                    params: {
                        code: val.code,
                        needIndex: 0,
                        need_k_pic:0,
                    }
                })
                .then( (res)=> {
                    if(res.showapi_res_body.stockMarket){
                        console.log(val)
                        res.showapi_res_body.stockMarket.dateRemark = val.dateRemark;
                        res.showapi_res_body.stockMarket.pattern = val.pattern;
                        this.msgList.push(res.showapi_res_body.stockMarket)
                    }
                    else{
                        this.msgList.push({code:val.code,name:val.name,dateRemark:val.dateRemark,pattern:val.pattern})
                    }
                    resolve(val);
                })
                .catch( (error)=> {
                    console.log(error);
                });
            });
            
        },
    }
}

</script>
<style>
.green{
    color:#58f50b;
}
.red{
    color: red;
}
</style>