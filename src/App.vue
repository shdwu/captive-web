<template>
  <!-- hello world -->
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'

  }
</script>

<style>

  #app {
    height: 100%;
  }

  html,
  body {
    padding: 0;
    margin: 0;
  }

 .line-class {
    text-decoration: underline;
    color: #409EFF
  }
</style>