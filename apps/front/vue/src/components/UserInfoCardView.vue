<template>
  <div>
    <div class="userInfo">
      <img class="avatar" :src="userData.avatar" alt="avatar de l'utilisateur" />
      <hr />
      <p>{{ `${this.userData.firstName} ${userData.lastName}` }}</p>
      <p>{{ this.userData.username }}</p>
      <hr />
      <div class="profilData">
        <p>Inscripion : <span id="inscriptionDate">{{ dateCreation() }}</span></p>
        <p>
          Posts : <span id="postsNumber">{{ userData.Posts.length }}</span>
        </p>
        <p>
          Commentaires : <span id="comsNumber">{{ userData.Comments.length }}</span>
        </p>
      </div>

      <div
        v-if="
          this.$store.state.user.id === this.userData.id || this.$store.state.user.isAdmin === true
        "
      >
        <hr />

        <div class="inputSection">
          <input
            @click="deleteAccount"
            class="profilInput"
            type="submit"
            value="Suprimer le compte"
          />

          <router-link :to="{ name: 'editprofil', params: { UserId: this.$store.state.user.id } }">
            <!-- <router-link to="/profil" > -->
            <input class="profilInput" type="button" value="Modifier le profil" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfoCardView',
  props: {
    userData: Object,
  },
  methods: {
    dateCreation() {
      const stamp = this.userData.createdAt;
      const date = new Date(stamp);
      const years = date.getFullYear();
      const months = date.getMonth() + 1;
      const day = date.getDate();
      return `Le ${day}/${months}/${years}`;
    },
    deleteAccount() {
      fetch(`http://localhost:3000/api/users/${this.userData.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((res) => console.log(res));
      if (this.$store.state.user.id === this.userData.id) {
        document.location.href = 'http://localhost:8080/login';
      } else {
        document.location.href = 'http://localhost:8080/';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.userInfo {
  background-color: #d7d7d7d8;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  border: solid 1px black;
  img {
    width: 250px;
    border-radius: 100%;
    object-fit: contain;
    height: 250px;
  }
  min-width: 300px;
}

.inputSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profilInput {
  background-color: #091f43;
  color: rgba(215, 215, 215);
  border-radius: 10px;
  margin: 10px;
  padding: 7px;
  min-width: 130px;
}
</style>
