<template>
  <div>
      <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
        <!-- 添加按钮 -->
         <el-button type="primary" @click="addclassify()">添加分类</el-button>
        <!-- 内容主题 -->
        <el-table
      :data="categoriesList"
      style="width: 100%"
      stripe
      border>
      <el-table-column
        type="index"
        label="索引"
        width="80">
      </el-table-column>
      <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="是否有效">
        <template v-slot="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="排序">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="success" v-else>三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
      </el-table-column>
    </el-table>
        <!-- 分页导航区域 -->
        <el-pagination
        @current-change="handleCurrentChange"
        :current-page="categories.pagenum"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

    </el-card>
    <!-- 添加分类提示框 -->
    <el-dialog
      title="添加分类"
      v-model="adddialogVisible"
      width="50%"
      @close="resetadd()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-form :model="postclassify" :rules="addrules" ref="ruleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="postclassify.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 级联选择器 -->
            <el-cascader
            v-model="selectedkeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value: 'cat_id', label:'cat_name',children:'children',checkStrictly:true }"
            @change="handleChange" clearable
            style="width:100%">
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="prevadd()">添 加</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CateSer',
  data () {
    return {
    // 请求携带的参数
      categories: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 接收数据
      categoriesList: [],
      //   总数据条数
      total: 0,
      columnsarry: [
        {
          label: '商品分类',
          prop: 'categoriesList.cat_name',
          width: '400px'
        }
      ],
      adddialogVisible: false,
      // 添加分类验证规则
      addrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 添加分类请求参数
      postclassify: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加父级数据
      parentCateList: [],
      // 选中的父级ID数组
      selectedkeys: []
    }
  },
  created () {
    this.getcateList()
  },
  methods: {
    //   获取页面数据
    async getcateList () {
      const { data: res } = await this.$http.get('categories', { params: this.categories })
      if (res.meta.status !== 200) return this.$message.error('获取商品信息失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 当前页数
    handleCurrentChange (val) {
      this.categories.pagenum = val
      this.getcateList()
    },
    // 添加分类数据获取
    prevadd () {
      this.$refs.ruleForm.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.postclassify)
        if (res.meta.status !== 201) this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.adddialogVisible = false
        this.getcateList()
      })
    },
    // 添加按钮函数
    addclassify () {
      this.getparentCateList()
      this.adddialogVisible = true
    },
    // 添加分类父级数据获取
    async getparentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级数据失败')
      this.parentCateList = res.data
    },
    handleChange () {
      if (this.selectedkeys.length > 0) {
        this.postclassify.cat_pid = this.selectedkeys[this.selectedkeys.length - 1]
        this.postclassify.cat_level = this.selectedkeys.length
      } else {
        this.postclassify.cat_pid = 0
        this.postclassify.cat_level = 0
      }
    },
    resetadd () {
      this.$refs.ruleForm.resetFields()
      this.selectedkeys = []
      this.postclassify.cat_pid = 0
      this.postclassify.cat_level = 0
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb{
    margin-bottom: 20px;
}
.el-button{
  margin-bottom: 20px;
}
.add-list{
  padding: 20px;
}
.add-button{
  float: right;
}
.clear-box{
  clear: right;
}
</style>
