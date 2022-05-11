<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 导航搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input3">
            <template v-slot:append>
              <el-button solt:append icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" round size="small">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- z主体区域 -->
      <el-table :data="getorder" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300">
        </el-table-column>
        <el-table-column prop="order_price" width="130" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" width="100" label="是否付款">
          <template v-slot="scope">
          <el-tag v-if="scope.row.pay_status ==='0'">未付款</el-tag>
          <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{this.timedata (scope.row.create_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="edit"
            ></el-button
          >
          <el-button type="success" icon="el-icon-location" size="small" @click="gressdialogVisible = true"
            ></el-button
          >
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getquery.pagenum"
      :page-size="getquery.pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
    v-model="dialogVisible"
    title="修改地址"
    width="50%"
    @close="handleClose"
  >
   <el-form :model="addressForm" :rules="addressrules" ref="addressFormrule" label-width="100px">
  <el-form-item label="省市区/县" prop="address1">
 <el-cascader
    :options="cityOptions"
    :value="city"
    @change="changeProvince"
    change-on-select
    style="width:100%;"
  >
  </el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
   </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 物流进度对话框 -->
<el-dialog
    v-model="gressdialogVisible"
    title="物流进度"
    width="50%"
  >
    <span>
      API错误
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { cityaddress } from './address'
import cityOptions from './city_data2017_element.js'
export default {
  name: 'OrderSer',
  data () {
    return {
      getquery: {
        query: '',
        pagenum: 1,
        pagesize: 8,
        user_id: '',
        pay_status: '',
        is_send: '',
        consignee_addr: ''
      },
      getorder: [],
      total: 0,
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressrules: {
        address1: [
          { required: true, message: '请选择区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      props: {
        expandTrigger: 'hover'
      },
      cityaddress: [],
      gressdialogVisible: false,
      getgress: [],
      cityOptions
    }
  },
  created () {
    this.getoeder()
  },
  methods: {
    async getoeder () {
      const { data: res } = await this.$http.get('orders', {
        params: this.getquery
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.getorder = res.data.goods
      this.total = res.data.total
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
    handleSizeChange (newpagesize) {
      this.getquery.pagenum = newpagesize
      this.getoeder()
    },
    handleCurrentChange (newpagenum) {
      this.getquery.pagenum = newpagenum
      this.getoeder()
    },
    handleClose () {
      this.$refs.addressFormrule.resetFields()
      this.cityOptions = []
    },
    handleChange () {},
    edit () {
      this.cityaddress = cityaddress()
      this.dialogVisible = true
    }
    // async showProgressBox () {
    //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
    //   if (res.meta.status !== 200) return this.$message.error('物流查询失败')
    //   this.getgress = res.data
    //   console.log(this.getgress)
    //   this.gressdialogVisible = true
    // }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 20px;
}
</style>
