<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 消息提示 -->
        <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <el-steps :active="activeindex-0" finish-status="success" align-center process-status="process">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
        </el-steps>
        <!-- 内容区域 -->
        <el-form :model="addForm" :rules="addrules" ref="addFormRif" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-tabs v-model="activeindex" tabPosition="left" @tab-click="tadclick()">
        <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
            v-model="addForm.goods_cat"
            :options="cateList"
            :props="cateprops"
            @change="handleChange()">
            </el-cascader>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabDate" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cd" v-for="(cd, i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTabDate" :key="item.attr_id">
          <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品照片" name="3">
           <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handsuccess"
          >
            <el-button type="primary"> 点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="addForm.goods_introduce"
            maxlength="300"
            show-word-limit
            class="content"
            rows="6"
          >
          </el-input>
          <el-button type="primary" @click="add()">添加商品</el-button>
        </el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
    <!-- 展示图片对话框 -->
    <el-dialog
      title="图片预览"
      v-model="dialogVisible"
      width="50%">
    <img :src="previewpath" alt="商品图片" class="pathprev">
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'AddSer',
  data () {
    return {
      activeindex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormLodsh: {
        goods_cat: []
      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyTabDate: [],
      onlyTabDate: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewpath: '',
      dialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 分类参数获取
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
    },
    async tadclick () {
      if (this.activeindex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
          item.attr_vals.length === 0
            ? []
            : item.attr_vals.split(' ')
        })
        this.manyTabDate = res.data
      } else if (this.activeindex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
        console.log(res.data)
        this.onlyTabDate = res.data
      }
    },
    handleRemove (file) {
      const filepath =
      file.response.data.tmp_path
      const i =
      this.addForm.pics.findIndex(x =>
        x.pic === filepath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    handlePreview (file) {
      this.previewpath = file.response.data.url
      this.dialogVisible = true
    },
    handsuccess (response) {
      console.log(response)
      const picinfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picinfo)
      console.log(this.addForm.pics)
    },
    add () {
      this.$refs.addFormRif.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的参数')
        this.addFormLodsh.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTabDate.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newinfo)
        })
        // 处理静态属性
        this.onlyTabDate.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newinfo)
        })
        console.log(this.addForm.attrs)
        console.log(this.addFormLodsh.goods_cat)
        const { data: res } = await this.$http.post('goods',
          {
            goods_name: this.addForm.goods_name,
            goods_cat: this.addFormLodsh.goods_cat,
            goods_price: this.addForm.goods_price,
            goods_number: this.addForm.goods_number,
            goods_weight: this.addForm.goods_weight,
            goods_introduce: this.addForm.goods_introduce,
            pics: this.addForm.pics,
            attrs: this.addForm.attrs
          })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateID () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert{
    margin-bottom: 20px;
}
.el-tabs{
    padding-top: 20px;
}
.el-steps{
    margin: 0 20px;
}
.el-checkbox{
  margin: 0 5px !important;
}
.pathprev{
  width: 100%;
}
.el-button{
  margin-top: 50px;
}
.content{
  height: 120px;
}
</style>
