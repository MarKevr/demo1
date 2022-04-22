<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="avatar">
      </div>
      <el-form :model="ruleForm"
               :rules="rules"
               label-width="0px"
               class="login-form"
               ref="ruleForm">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid"
                    v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-unlock"
                    show-password
                    v-model="ruleForm.password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <p>注册</p>
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="info"
                     @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginSer',
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          {
            min: 4,
            max: 12,
            message: '长度在 4 到 12 个字符',
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
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.ruleForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login-form {
      position: absolute;
      bottom: 60px;
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      p{
        color: rgb(177, 177, 177);
        position: absolute;
        left: 20px;
        top: 120px;
      }
      .btns {
        position: absolute;
        right: 20px;
        bottom: -50px;
      }
    }
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid rgb(201, 201, 201);
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px rgb(158, 158, 158);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgb(255, 255, 255);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

// .btns{
//   position: absolute;
//   right: 20px;
//   bottom: -100px;
// }
</style>
