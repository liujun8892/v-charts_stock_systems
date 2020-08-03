<template>
    <div class="content">
        <div v-show="!isPersonStockPage" >
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="自选" name="1"></el-tab-pane>
                <el-tab-pane label="预警1" name="2"></el-tab-pane>
                <el-tab-pane label="预警2" name="3"></el-tab-pane>
                <el-tab-pane label="买点股" name="4"></el-tab-pane>
            </el-tabs>
            <div class="search" >
                <el-input v-model="code" placeholder="请输入股票代码/拼音/名字"></el-input>
                <el-button

                        type="primary"
                        @click="toSearch()">搜索
                </el-button>
                <el-switch
                        v-model="value"
                        active-color="#13ce66"
                        @change='changeStatus'
                        inactive-color="#ff4949">
                </el-switch>
            </div>
        </div>
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <div class="avatar">
                <el-image src="./src/assets/img/avatar.png"></el-image>
<!--                <img src="src/assets/img/avatar.png" alt="">-->
                <span>eric</span>
            </div>
            <el-menu-item index="1">
        <span slot="title"><router-link to="/content" class="link"><span
                :class="{'active':$route.path==='/content'}">首页</span></router-link></span>
            </el-menu-item>
            <el-menu-item index="2">
        <span slot="title"><router-link to="/personal_stock" class="link"><span
                :class="{'active':$route.path==='/personal_stock'}">个股页</span></router-link></span>
            </el-menu-item>
            <!-- <el-menu-item index="2">
              <span slot="title"><router-link to="/index1" class="link"><span :class="{'active':$route.name=='index1'}">历史记录</span></router-link></span>
            </el-menu-item> -->
        </el-menu>
        <router-view :class="{'contentView':true,'contentViewPersonal':$route.path==='/personal_stock'}" ref='routes'/>

        <el-dialog title="股票列表" :visible.sync="dialogTableVisible" class="dialogs">
            <el-table :data="list" max-height='500'>
                <el-table-column prop="code" label="股票代码"></el-table-column>
                <el-table-column prop="name" label="股票名称"></el-table-column>
                <el-table-column prop="address" align='center' label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="addData( scope.row.code,scope.row.name,scope.$index)">添加
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<style>

</style>

<script>


    export default {
        components: {},
        data() {

            return {
                activeName: '1',
                code: '',
                list: [],
                value: localStorage.getItem('bole') == 'true' ? true : false,
                dialogTableVisible: false,
                isPersonStockPage: false
            }
        },
        created() {
            switch (this.$route.name) {
                case 'content':
                    this.activeName = '1';
                    break;
                case 'index1':
                    this.activeName = '2';
                    break;
                case 'index2':
                    this.activeName = '3';
                    break;
                case 'mai':
                    this.activeName = '4';
                    break;
            }
            this.isPersonStockPage = this.$route.path === '/personal_stock';
        },
        methods: {
            changeStatus(val) {
                localStorage.setItem('bole', val);
                this.value = val;
            },
            addData(code, name, index) {
                let arr = localStorage.getItem('codeArr') ? JSON.parse(localStorage.getItem('codeArr')) : [];
                let obj = {
                    code: code,
                    name: name,
                    dateRemark: '',
                    pattern: '',
                }
                if (arr.indexOf(obj) != -1) {
                    this.$message({
                        message: '已存在列表',
                        type: 'danger'
                    });
                    return;
                }
                this.list.splice(index, 1)
                arr.unshift(obj);
                localStorage.setItem('codeArr', JSON.stringify(arr));
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                // this.list = [];
                this.code = '';
                // this.dialogTableVisible = false;
                if (this.$refs.routes.getList) {
                    this.$refs.routes.getList();
                }
            },
            toSearch() {
                let code = '';
                let name = '';
                let pinyin = '';
                var pattern = new RegExp("[\u4E00-\u9FA5]+");
                var pattern2 = new RegExp("[A-Za-z]+");
                var pattern3 = new RegExp("[0-9]+");
                if (pattern.test(this.code)) {
                    name = this.code
                } else if (pattern2.test(this.code)) {
                    pinyin = this.code;
                } else if (pattern3.test(this.code)) {
                    code = this.code
                } else {
                    this.$message('请输入正确的值');
                    return;
                }
                this.list = [];
                this.axios({
                    method: 'get',
                    url: '/name-to-stockinfo',
                    params: {
                        code: code,
                        name: name,
                        pinyin: pinyin,
                    }
                })
                    .then((res) => {
                        this.list = res.showapi_res_body.list;
                        this.dialogTableVisible = true;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClick() {
                console.log(this.activeName)
                switch (parseInt(this.activeName)) {
                    case 1:
                        if (this.$route.name != 'content') {
                            this.$router.push({
                                path: '/content'
                            })
                        }
                        break;
                    case 2:
                        if (this.$route.name != 'index1') {
                            this.$router.push({
                                path: '/index1'
                            })
                        }
                        break;
                    case 3:
                        if (this.$route.name != 'index2') {
                            this.$router.push({
                                path: '/index2'
                            })
                        }
                        break;
                    case 4:
                        if (this.$route.name != 'mai') {
                            this.$router.push({
                                path: '/mai'
                            })
                        }
                        break;
                }
            },
        },
        // 路由到个股页
        beforeRouteUpdate(to,from,next){
            this.isPersonStockPage = to.path === '/personal_stock';
            next()
        }
    }

</script>

<style scoped>
    /* .dialogs{
      max-height: 500px;
    } */
    .search {
        position: absolute;
        height: 40px;
        right: 0px;
        background: #fff;
        top: 5px;
        z-index: 1000;
    }

    .search div {
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }

    .search button {
        margin-right: 10px;
    }

    /deep/ .el-tabs__nav {
        margin-left: 10px;
    }

    .contentView {
        flex: 1;
        padding-left: 160px;
        padding-top: 40px;
        overflow: scroll;
    }

    .active {
        color: #409EFF;
    }

    .link {
        color: #fff;
        text-decoration: none;
        display: inline-block;
        width: 100%;
        height: 100%;
    }

    .content {
        width: 100%;
        height: 100vh;
        display: flex;
        padding-top: 0px;
        margin: 0 auto;
        background: #fff;
        overflow-y: scroll;
        position: relative;
    }

    .el-tabs {
        left: 150px;
        position: absolute;
        width: calc(100% - 150px);
        top: 10px;
        background: #fff;
        z-index: 999;
    }

    .el-menu-vertical-demo {
        position: absolute;
        width: 150px;
        left: 0;
        top: 0;
        /* padding-top: 10%; */
        padding-top: 50px;
        height: calc(100% - 50px);
    }
    .contentView.contentViewPersonal {
       padding-top: 0;
        padding-left: 150px;
        display: flex;
   }
    .avatar {
        position: absolute;
        width: 100%;
        height: 50px;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
    }
</style>