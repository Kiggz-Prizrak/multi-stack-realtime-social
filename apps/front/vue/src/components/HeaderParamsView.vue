<template>
  <div class="postReaction">
    <span>
      <i class="fas fa-caret-down"></i>
    </span>
    <div class="ParamsInput">
      <div class="inputsBlock">
        <input @click="logout" class="postOptions" type="submit" value="Déconnexion" />
        <router-link to="dashboard" v-if="this.$store.state.user.isAdmin" class="postOptions">
          <p class="dashboardLink">Dashboard</p>
        </router-link>
      </div>

      <!--
      <input
        v-if="this.$store.state.user.isAdmin"
        class="postOptions"
        type="button"
        value="Dashboard"
      /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderParams',
  methods: {
    logout() {
      localStorage.clear();
      document.location.href = 'http://localhost:8080/login';
    },
  },
};
</script>

<style scoped lang="scss">
.postReaction {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  h4,
  span {
    padding: 10px;
    color: #3f3f3f;
    margin: 0px;
  }
  .ParamsInput {
    display: none;
  }
  .inputsBlock {
    display: flex;
  }
  span {
    transform: rotate(90deg);
  }
  &:hover {
    .ParamsInput {
      display: block;
    }
    span {
      color: #3f3f3f;
      transform: rotate(270deg);
    }
    input {
      background-color: transparent;
      border: none;
      font-size: 14px;
      font-weight: bold;
      &:hover {
        color: #d1515a;
        cursor: pointer;
      }
    }
  }
  .dashboardLink {
    background-color: transparent;
      border: none;
      font-size: 14px;
      font-weight: bold;
      padding-left: 8px;
      &:hover {
        color: #d1515a;
        cursor: pointer;
      }
  }
}
</style>
