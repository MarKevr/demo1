<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区域 -->
      <el-card class="box-card">
        <div>
          <el-table
          :data="rightslist"
          style="width: 100%"
          border
          stripe>
            <el-table-column
            type='index'
            label="索引"
            width="80">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径">
            </el-table-column>
            <el-table-column
            prop="level"
            label="权限等级">
            <template v-slot="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
            </template>
            </el-table-column>
         </el-table>
        </div>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'RightsSer',
  data () {
    return {
      rightslist: []
    }
  },
  created () {
    this.getrightslist()
  },
  methods: {
    async getrightslist () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightslist = res.data
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
</style>
