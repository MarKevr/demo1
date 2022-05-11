<template>
<el-container class="home_container">
  <el-header>
    <div>
      <img src="../assets/logo.png" alt="logo">
      <h1>Vue项目电商管理后台系统</h1>
    </div>
    <el-button type="info" @click="logout" class="reset">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="collspase?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollspase">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse='collspase'
      :collapse-transition='false'
      router
      :default-active='activepath'>
      <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
        <template v-slot:title>
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="'/'+subItm.path" v-for="subItm in item.children" :key="subItm.id" @click="SaveNastate('/'+subItm.path)">
            <template v-slot:title>
              <i class="el-icon-menu"></i>
              <span>{{subItm.authName}}</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'HomeSer',
  created () {
    this.getMenuList()
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  data () {
    return {
      menulist: [],
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-help',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      collspase: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollspase () {
      this.collspase = !this.collspase
    },
    SaveNastate (activepath) {
      window.sessionStorage.setItem('activepath', activepath)
    }
  }
}
</script>

<style lang='less' scoped>
.home_container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  user-select: none;
  display: flex;
  justify-content:space-between;
  align-items: center;
  div{
    display: flex;
    color: #EAEDF1;
    align-items: center;
    img{
      width: 40px;
      height:40px;
      padding-right:10px;
    }
  }
  .reset{
    height: 40px;
    padding: 0 20px;
  }
}
.el-aside{
  background-color: #333744;
  user-select: none;
  .el-menu{
    border-right: none;
  }
  .toggle-button{
    background-color: #4A5064;
    color: #EAEDF1;
    text-align: center;
    font-size: 10px;
    cursor: pointer;
  }
  .el-submenu {
    .el-menu-item-group{
      padding: 0;
    }
  }
}
.el-main{
  background-color: #EAEDF1;
}
</style>
