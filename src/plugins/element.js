import {
  ElButton,
  ElForm,
  ElInput,
  ElFormItem,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElSubmenu,
  ElMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElPagination,
  ElDialog,
  ElTooltip,
  ElMessageBox
} from 'element-plus'
// import Vue from 'vue'
export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElMessage)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElSubmenu)
  app.use(ElMenu)
  app.use(ElMenuItemGroup)
  app.use(ElMenuItem)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElSwitch)
  app.use(ElPagination)
  app.use(ElDialog)
  app.use(ElTooltip)
  app.use(ElMessageBox)
}
// Vue.prototype.$message = Message
