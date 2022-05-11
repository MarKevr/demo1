<template>
  <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px;height:400px;">服务器异常</div>
    </el-card>
  </div>
</template>
<script>
// import echarts from 'echarts'
export default {
  name: 'ReportSer'
  // async mounted () {
  // // 基于准备好的dom，初始化echarts实例
  //   const myChart = echarts.init(document.getElementById('main'))
  //   // 指定图表的配置项和数据
  //   const { data: res } = await this.$http.get('reports/type/1')
  //   if (res.meta.status !== 200) return this.$message.error('数据获取失败')
  //   console.log(res.data)
  //   // 使用刚指定的配置项和数据显示图表。
  //   myChart.setOption(res.data)
  // }
}
</script>

<style>

</style>
