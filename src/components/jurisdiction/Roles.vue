<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-button type="primary" @click="adddialogVisible = true">添加</el-button>
        <!-- 列表区域 -->
        <el-table
          :data="roleslist"
          style="width: 100%"
          border
          stripe>
          <el-table-column
          type='expand'
          label="权限查看"
          width="120">
          <template v-slot="scoped">
            <el-row :class="['bdbottom', i1 ===0 ? 'bdtop':'']" v-for="(item1, i1) in scoped.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removerightbyId(scoped.row,item1)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="['bdtop', i2 ===0 ? '':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable type="success" @close="removerightbyId(scoped.row,item2)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag @close="removerightbyId(scoped.row,item3)" closable v-for="(item3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          </el-table-column>
          <el-table-column
          type='index'
          label="索引"
          width="80">
          </el-table-column>
          <el-table-column
          prop="roleName"
          label="角色名称">
          </el-table-column>
          <el-table-column
          prop="roleDesc"
          label="角色描述">
          </el-table-column>
          <el-table-column
          prop=""
          label="操作"
          width="300px">
          <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click="getEditList(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deletroles(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-s-tools" @click="showsetrightDilog(scope.row)">分配权限</el-button>
          </template>
          </el-table-column>
        </el-table>
        <!-- 添加列表 -->
        <el-dialog
      title="添加角色"
      v-model="adddialogVisible"
      width="50%"
      @close="reset()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-form :model="roleslistadd" :rules="addFromrules" ref="addFromRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleslistadd.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
        <el-input v-model="roleslistadd.roleDesc" placeholder="非必填项"></el-input>
        </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addroles()">确 定</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      v-model="editdialogVisible"
      width="50%">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-form :model="roleseditdata" :rules="editFromrules" ref="editFromRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleseditdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
        <el-input v-model="roleseditdata.roleDesc" placeholder="非必填项"></el-input>
        </el-form-item>
        </el-form>
      </div>
      <div class="add-button">
      <el-button @click="editdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editroles()">保 存</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      v-model="dictiondialogVisible"
      width="50%"
      @close="resetarry()">
      <template v-slot: footer class="dialog-footer">
      <div class="add-list">
        <el-tree :data="rightsList" :props="treeprops" show-checkbox default-expand-all node-key="id"
        :default-checked-keys="keysarray" ref="treeref"
        check-on-click-node></el-tree>
      </div>
      <div class="add-button">
      <el-button @click="dictiondialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dictionroles()">保 存</el-button>
      </div>
      <div class="clear-box"></div>
      </template>
    </el-dialog>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'RolesSer',
  data () {
    return {
      roleslist: [],
      rolesedit: [],
      roleslistadd: {
        roleName: '',
        roleDesc: ''
      },
      adddialogVisible: false,
      editdialogVisible: false,
      dictiondialogVisible: false,
      addFromrules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '', trigger: 'blur' }
        ]
      },
      editFromrules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '', trigger: 'blur' }
        ]
      },
      roleseditdata: {},
      rightsList: [],
      treeprops: {
        children: 'children',
        label: 'authName'
      },
      keysarray: [],
      roleid: ''
    }
  },
  created () {
    this.getroleslist()
    // this.getrolesedit()
  },
  methods: {
    async getroleslist () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleslist = res.data
    },
    addroles () {
      this.$refs.addFromRef.validate(async vild => {
        if (!vild) return
        const { data: res } = await this.$http.post('roles', this.roleslistadd)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.getroleslist()
        this.adddialogVisible = false
      })
    },
    reset () {
      this.$refs.addFromRef.resetFields()
    },
    async getEditList (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取id失败')
      this.roleseditdata = res.data
      this.editdialogVisible = true
    },
    async editroles () {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.roleseditdata.roleId, {
          roleName: this.roleseditdata.roleName,
          roleDesc: this.roleseditdata.roleDesc
        })
        if (res.meta.status !== 200) {
          this.editdialogVisible = false
          return this.$message.error('编辑失败')
        }
        this.$message.success('编辑成功')
        this.getroleslist()
        this.editdialogVisible = false
      })
    },
    // async deletroles () {
    //   const { data: res } = await this.$http.delete('roles/' + this.roleseditdata.id)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('删除失败')
    //   }
    //   this.$message.success('删除成功')
    // },
    async deletroles (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.message.error('删除用户失败')
        this.getroleslist()
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
    },
    async removerightbyId (id1, id2) {
      const confirmReuit = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmReuit !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`roles/${id1.id}/rights/${id2.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      id1.children = res.data
    },
    async showsetrightDilog (role) {
      // 获取所有权限的数据
      this.roleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightsList = res.data
      this.getLeafkeys(role, this.keysarray)
      this.dictiondialogVisible = true
    },
    getLeafkeys (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item =>
        this.getLeafkeys(item, arr))
    },
    resetarry () {
      this.keysarray = []
    },
    async dictionroles () {
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idstar = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idstar })
      if (res.meta.status !== 200) return this.$message.error('授权失败')
      this.$message.success('权限修改成功')
      this.getroleslist()
      this.dictiondialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
.el-button{
  font-size: 10px;
  padding: 5px 15px;
}
.el-table{
  margin-top: 20px;
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
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.el-tag{
  margin: 10px 10px;
}
.el-row{
  display: flex;
  align-items: center;
}
</style>
