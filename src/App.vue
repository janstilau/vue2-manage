<template>
  <div id="app" class="fillcontain">
    <!-- RouterView, 占据了整个页面的空间, 所以每次 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<!-- 
    因为根组件没有使用 scoped, 那么它的样式, 会应用到整个应用中, 包括子组件. 
 -->
<style lang="less">
@import "./style/common";
</style>
