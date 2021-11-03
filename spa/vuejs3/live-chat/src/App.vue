<template>
  <img alt="Vue logo" src="./assets/logo.png">
    <fast-comments-live-chat v-bind:config="{tenantId: 'demo'}"/>
</template>

<script>
import {FastCommentsLiveChat} from 'fastcomments-vue-next';

export default {
  name: 'App',
  components: {
    FastCommentsLiveChat
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
