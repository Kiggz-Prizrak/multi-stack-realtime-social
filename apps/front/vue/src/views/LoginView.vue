<template>
  <div class="containerLogin">
    <Header />
    <form @submit.prevent="submitLogin">
      <img class="titreLogin" alt="titre" src="../assets/icon-left-font-monochrome-red.titre.png" />
      <label for="email">
        Adresse E-mail
        <input v-model="email" id="email" type="email" name="email" />
      </label>
      <label for="password">
        Mot de passe
        <input v-model="password" id="password" type="password" name="password" />
      </label>
      <input class="submitBtn" type="submit" value="SE CONNECTER" />
      <hr />
      <p>{{ errorMessage }}</p>
      <router-link to="/signup">
        <p class="linkCreateUser">Créer un compte</p>
      </router-link>
    </form>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/FooterView.vue';
import Header from '@/components/HeaderPublicView.vue';

export default {
  name: 'LoginView',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    submitLogin() {
      if (
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_.@$!%*#?&])[A-Za-z\d_.@$!%*#?&]{8,}$/.test(
          this.password,
        )
        && /^[\w\d.+-]+@[\w.-]+\.[a-z]{2,}$/.test(this.email)
      ) {
        const userlog = {
          email: this.email,
          password: this.password,
        };
        console.log(userlog);

        fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userlog),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            this.errorMessage = res.error;
            const { token, user } = res;
            this.$store.dispatch('setToken', token);
            this.$store.dispatch('setUser', user);
            if (user === undefined || token === undefined) {
              localStorage.clear();
            } else {
              document.location.href = 'http://localhost:8080/';
            }
          });
      }
      this.errorMessage = 'Veuillez renseigner correctement tous les champs';
      // const userlog = {
      //   email: this.email,
      //   password: this.password,
      // };
      // console.log(userlog);

      // fetch('http://localhost:3000/api/users/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userlog),
      // })
      //   .then((res) => res.json())
      //   .then((res) => {
      //     console.log(res);
      //     const { token, user } = res;
      //     this.$store.dispatch('setToken', token);
      //     this.$store.dispatch('setUser', user);
      //     if (user === undefined || token === undefined) {
      //       localStorage.clear();
      //     } else {
      //       document.location.href = 'http://localhost:8080/';
      //     }
      //   });
    },
  },
};
</script>

<style scoped lang="scss">
.titreLogin {
  width: 50%;
  margin: 18px 0px 18px 0px;
}
.containerLogin {
  background-image: url('@/assets/backgroundClair.jpg');
  background-position: top;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #d7d7d7d8;
  max-width: 562px;
  border-radius: 10px;
  border: 1px solid black;
  padding: 18px 0px 18px 0px;
}
label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  font-size: 25px;
  font-weight: bold;
  margin: 18px 0px 18px 0px;
  input {
    height: 50px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 2px 2px 5px #3f3f3f;
    margin-top: 10px;
  }
}
.submitBtn {
  width: 40%;
  border-radius: 10px;
  height: 50px;
  background-color: #d1515a;
  color: #3f3f3f;
  box-shadow: 2px 2px 5px #3f3f3f;
  font-weight: bold;
  margin: 18px 0px 18px 0px;
  font-size: 16px;
}
P {
  font-size: 18px;
  margin: 18px 0px 18px 0px;
}
hr {
  width: 75%;
  margin: 18px 0px 18px 0px;
}
.linkCreateUser {
  color: #d1515a;
  font-weight: bold;
}
</style>
