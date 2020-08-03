<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
.charts{
  width: 100%;
  height:100%;
}
*{
	margin: 0 ;
	padding: 0;
}
html,body{
	/* background: rgb(84, 92, 100); */
  background: #000;
	/* height: 100%;
	min-height: 100%; */
}
#app {
 width: 100%;
 height: 100%;
 /* overflow-y: scroll; */
 margin: 0 auto;
 /* background: #fff; */
}
::-webkit-scrollbar{
  display: none;

}
.el-table {
  margin-top: 10px;
}

</style>
