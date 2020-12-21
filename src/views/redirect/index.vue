<script>
export default {
  created() {
    //在重新定向回原来相同的页面，实现相同路由跳转能够刷新组件的效果
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // 避免警告信息，组件必须有`template`或者`render`
  }
}
</script>
