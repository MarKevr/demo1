import { ElButton, ElForm, ElInput, ElFormItem, ElMessage } from 'element-plus'
// import Vue from 'vue'
export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElMessage)
}
// Vue.prototype.$message = Message
