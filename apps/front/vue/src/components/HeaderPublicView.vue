<template>
  <nav>
    <router-link to="/">
      <img class="logoHeader" src="../assets/icon-left-font-monochrome-black-rogne.png" alt="">
    </router-link>
  </nav>
</template>

<script>
export default {
};
</script>

<style scoped lang="scss">
  .logoHeader {
  height: 35px;
}
nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #D7D7D7 ;
  padding: 10px;
  border-bottom: 2px solid #D1515A;
  box-shadow: 2px 2px 5px #3F3F3F;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
