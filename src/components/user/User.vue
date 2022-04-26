<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加框 -->
    <el-row :gutter="40">
      <el-col :span="8">
        <div class="search">
        <el-input placeholder="输入姓名查询" v-model="UserList.query" clearable @clear="getusers()">
          <template v-slot:append>
            <el-button slot:append icon="el-icon-search" @click="getusers()"></el-button>
          </template>
        </el-input>
        </div>
      </el-col>
      <el-col :span="4"><el-button type="primary" round @click="adddialogVisible = true">添加</el-button></el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table
      :data="userlist"
      stripe
      border>
      <el-table-column
        type="index"
        label="索引"
        width="50px">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
        <template v-slot="scope">
          <el-switch
        v-model="scope.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changestate(scope.row)">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="200px">
        <template v-slot="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editdialog(scope.row.id)">
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row.id)"></el-button>
        <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
          <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
        </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="UserList.pagenum"
      :page-size="UserList.pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加信息 -->
    <el-dialog
      title="添加用户"
      v-model="adddialogVisible"
      width="50%"
      @close="reset()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-form :model="addForm" :rules="addFromrules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
        <el-input
        v-model="addForm.mobile"
        oninput="value=value.replace(/[^\d]/g,'');if(value.length > 11)value = value.slice(0, 11)"></el-input>
        </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="add()">确 定</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog
      title="修改用户"
      v-model="editdialogVisible"
      width="50%">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-form :model="editFrom" :rules="editFromrules" ref="editFromRef" label-width="70px">
        <el-form-item label="用户名">
        <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
        <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
        <el-input
        v-model="editFrom.mobile"
        oninput="value=value.replace(/[^\d]/g,'');if(value.length > 11)value = value.slice(0, 11)"></el-input>
        </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="editdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="edituser()">确 定</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserSer',
  data () {
    return {
      UserList: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0,
      adddialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      editdialogVisible: false,
      editFrom: {},
      editFromrules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getusers()
  },
  methods: {
    async getusers () {
      const { data: res } = await this.$http.get('users', { params: this.UserList })
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      console.log(res)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    async changestate (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo = !userinfo
        return this.$message.error('更新用户状态失败')
      }
      this.$messgae.success('更新用户状态成功')
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.UserList.pagesize = val
      this.getusers()
    },
    handleCurrentChange (val) {
      this.UserList.pagenum = val
      this.getusers()
    },
    add () {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.adddialogVisible = false
        this.$message.success('添加用户成功')
        this.getusers()
      })
    },
    reset () {
      this.$refs.addFormRef.resetFields()
    },
    async editdialog (id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户失败')
      this.editFrom = res.data
    },
    edituser () {
      this.$refs.editFromRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put('users/' + this.editFrom.id, { email: this.editFrom.email, mobile: this.editFrom.mobile })
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功')
        this.getusers()
        this.editdialogVisible = false
      })
    },
    async open (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.message.error('删除用户失败')
        this.getusers()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // .catch(err => err)
      // if (confirmResult !== confirm) {
      //   return this.$message.info('已取消删除')
      // }
      // const { data: res } = await this.$htto.delete('users/' + id)
      // if (res.meta.status !== 200) return this.message.error('删除用户失败')
      // this.message.success('删除用户成功')
      // this.getusers()
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
.el-table{
    margin-top: 15PX;
}
.el-pagination{
    margin-top: 15PX;
}
.search{
  display: flex;
  // width: 250px;
}
.el-card{
  height: 600px;
  position: relative;
  .el-pagination{
  position: absolute;
  bottom: 20px;
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
}
</style>
