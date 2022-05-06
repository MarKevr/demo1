<template>
  <div>
      <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
      title="注意： 只允许第三级商品分类设置参数"
      type="warning"
      show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="elrow">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="car_idkey"
            :options="getparamsList"
            :props="props"
            @change="handleChange()">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 子菜单区域 -->
       <el-tabs v-model="activeName" @tab-click="handleTabClick">
         <!-- 动态参数面板 -->
        <el-tab-pane label="用户管理" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" :disabled='isBtnDisabled' style="margin-bottom:20px"  @click="adddialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manytagdata" border stripe>
            <!-- 索引列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染的TAG标签 -->
                <el-tag closable @close="handclose(i,scope.row)" v-for="(item, i) in scope.row.attr_vals" :key="i" style="margin:10px">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index' label="索引" width="80px"></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="editdialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数面板 -->
        <el-tab-pane label="配置管理" name="only">
          <!-- 添加参数按钮 -->
          <el-button type="primary" :disabled='isBtnDisabled' style="margin-bottom:20px" @click="adddialogVisible = true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlytagdata" border stripe>
            <!-- 索引列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染的TAG标签 -->
                <el-tag closable @close="handclose(i,scope.row)" v-for="(item, i) in scope.row.attr_vals" :key="i" style="margin:10px">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index' label="索引" width="80px"></el-table-column>
            <el-table-column label='属性名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="editdialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="tabletext"
      v-model="adddialogVisible"
      width="50%"
      @close="resetdialog()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <!-- 添加参数的对话框 -->
        <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item :label="tabletext" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary"  @click='addparams()'>添 加</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
     <el-dialog
      :title="tabletext"
      v-model="editdialogVisible"
      width="50%"
      @close="reseteditdialog()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
    <el-form :model="editForm" :rules="editrules" ref="editruleForm" label-width="100px">
          <el-form-item :label="tabletext" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="editdialogVisible = false">取 消</el-button>
      <el-button type="primary"  @click='editparams()'>添 加</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProducSer',
  data () {
    return {
      // 获取商品分类数据数组
      getparamsList: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      car_idkey: [],
      activeName: 'many',
      manytagdata: [],
      onlytagdata: [],
      adddialogVisible: false,
      addForm: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editdialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getparams()
  },
  methods: {
    // 获取商品分类数据
    async getparams () {
      const { data: res } = await this.$http.get('categories', { parama: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.getparamsList = res.data
      console.log(this.getparamsList)
    },
    // 级联选择框触发函数
    async handleChange () {
      if (this.car_idkey.length !== 3) {
        this.car_idkey = []
        this.manytagdata = []
        this.onlytagdata = []
        return
      }
      console.log(this.car_idkey)
      // 根据所选的ID，和当前所处的面板。或取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('参数获取失败')
      }
      this.editID = res.data
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ') || item.attr_vals.split(',')
          : []
        // 可控制显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manytagdata = res.data
      } else {
        this.onlytagdata = res.data
      }
    },
    handleTabClick () {
      this.handleChange()
      console.log(this.activeName)
    },
    resetdialog () {
      this.$refs.ruleForm.resetFields()
    },
    addparams () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.handleChange()
        this.adddialogVisible = false
      })
    },
    editparams () {
      this.$refs.editruleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.editdialogVisible = false
        this.handleChange()
      })
    },
    async editdialog (attr) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${attr}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取ID失败')
      this.editForm = res.data
    },
    reseteditdialog () {
      this.$refs.editruleForm.resetFields()
    },
    // 文本框失去焦点或按下enter见保存标签
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = true
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存操作
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      // 发起请求保存操作
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改标签成功')
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      this.nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handclose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.car_idkey.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级ID
    cateID () {
      if (this.car_idkey.length === 3) {
        return this.car_idkey[2]
      }
      return null
    },
    tabletext () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.elrow{
  margin: 20px 0;
}
.input-new-tag{
  width: 80px;
}
</style>
