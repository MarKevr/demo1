<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 导航搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
        <el-input placeholder="请输入内容">
        <template v-slot:append>
          <el-button solt:append icon="el-icon-search"></el-button>
        </template>
          </el-input>
        </el-col>
        <el-col :span="4">
        <el-button type="primary" round size="small"  @click="addsport()">添加商品</el-button>
        </el-col>
      </el-row>
    <!-- 商品主体区域 -->
    <el-table
      :data="goodslist"
      style="width: 100%"
      border
      stripe>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        width="130"
        label="商品价格（元）">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        width="100"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot="scope" >
        {{this.timedata(scope.row.upd_time)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
      <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加商品表单 -->
  </div>
</template>

<script>

export default {
  name: 'GoodsList',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      total: 0
    }
  },
  created () {
    this.gteGoodslist()
  },
  methods: {
    // 根据分页获取数据列表
    async gteGoodslist () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.gteGoodslist()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.gteGoodslist()
    },
    timedata (originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    addsport () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang='less' scoped>
.el-row{
  margin-bottom: 20px;
}
</style>
