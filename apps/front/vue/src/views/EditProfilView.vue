<template>
  <div class="container">
    <Header />
    <form @submit.prevent="edit">
      <h1>Modifier le profil</h1>
      <div class="fieldsContainer">
        <label for="firstName">
          *Prénom de l'utilisateur
          <input v-model="firstName" type="text" id="firstName" name="firstName" />
        </label>

        <label for="lastName">
          *Nom de l'utilisateur
          <input v-model="lastName" type="text" id="lastName" name="lastName" />
        </label>

        <label for="lastName">
          Pseudo
          <input v-model="username" type="text" id="surname" name="surname" />
        </label>

        <label for="avatar">
          Avatar
          <div class="InputAvatar">
            <span id="iconMediaa"><i class="fas fa-images"></i></span>
            <input
              class="media"
              type="file"
              ref="inputFile"
              id="avatar"
              name="media"
              accept="image/png, image/jpeg"
            />
          </div>
        </label>

        <label for="email">
          *Adresse E-mail
          <input v-model="email" id="email" type="email" name="email" />
        </label>

        <label for="email">
          *Vérification de l'adresse E-mail
          <input v-model="emailConfirmation" id="email" type="email" name="email" />
        </label>

        <label for="password">
          *Mot de passe
          <input v-model="password" id="password" type="password" name="password" />
        </label>

        <label for="password">
          *Vérification du mot de passe
          <input v-model="passwordConfirmation" id="password" type="password" name="password" />
        </label>
      </div>
      <input class="submitBtn" type="submit" value="MODIFIER" />
      <hr />
      <p>*Champs Obligatoire {{ this.linkMedia }}</p>
    </form>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/FooterView.vue';
import Header from '@/components/HeaderView.vue';

export default {
  name: 'EditProfil',
  components: {
    Footer,
    Header,
  },
  props: {
    UserId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      firstName: this.$store.state.user.firstName,
      lastName: this.$store.state.user.lastName,
      username: this.$store.state.user.username,
      password: '',
      passwordConfirmation: '',
      email: this.$store.state.user.email,
      emailConfirmation: this.$store.state.user.email,
    };
  },
  methods: {
    upadateProfilKeepAvatar() {
      if (this.email === this.emailConfirmation && this.password === this.passwordConfirmation) {
        const { user } = this.$store.state;
        const userEdited = JSON.stringify({
          firstName: this.firstName !== user.firstName ? this.firstName : undefined,
          lastName: this.lastName !== user.lastName ? this.lastName : undefined,
          username: this.username !== user.username ? this.username : undefined,
          password: this.password || undefined,
          email: this.email !== user.email ? this.email : undefined,
        });

        fetch(`http://localhost:3000/api/users/${this.UserId}`, {
          body: userEdited,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((res) => {
            this.$store.dispatch('setUser', res.user);
            this.$router.push({ name: 'profil' });
          });
      }
    },
    updatePostWithAvatar() {
      if (this.email === this.emailConfirmation && this.password === this.passwordConfirmation) {
        const { user } = this.$store.state;
        const userEdited = new FormData();

        userEdited.append('avatar', this.$refs.inputFile.files[0] ?? this.$store.user.avatar);

        if (this.firstame !== user.firstName) {
          userEdited.append(
            'firstName',
            this.firstName !== user.firstName ? this.firstName : undefined,
          );
        }
        if (this.lastName !== user.lastName) {
          userEdited.append(
            'lastName',
            this.lastName !== user.lastName ? this.lastName : undefined,
          );
        }
        if (this.username !== user.username) {
          userEdited.append(
            'username',
            this.username !== user.username ? this.username : undefined,
          );
        }
        if (this.password) {
          userEdited.append('password', this.password || undefined);
        }
        if (this.email !== user.email) {
          userEdited.append('email', this.email !== user.email ? this.email : undefined);
        }

        fetch(`http://localhost:3000/api/users/${this.UserId}`, {
          body: userEdited,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            this.$store.dispatch('setUser', res.user);
            this.$router.push({ name: 'profil' });
          });
      }
    },

    edit() {
      if (this.$refs.inputFile.files[0]) {
        return this.updatePostWithAvatar();
      }
      return this.upadateProfilKeepAvatar();
    },
  },
};
</script>

<style scoped lang="scss">
.titreLogin {
  width: 50%;
  margin: 18px 0px 18px 0px;
}
.container {
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
  max-width: 1000px;
  border-radius: 10px;
  border: 1px solid black;
  padding: 18px;
}
.fieldsContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}
label {
  max-width: 400px;
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
  min-width: 180px;
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
.media {
  display: flex;
  input {
    display: none;
  }
}
.InputAvatar {
  border: 2px solid #3f3f3f;
  display: flex;
  align-items: center;
  height: 50px;
  margin-top: 10px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 2px 2px 5px #3f3f3f;
  background-color: white;
  span {
    margin-left: 10px;
    font-size: 22px;
  }
  p {
    margin-left: 10px;
    font-size: 12px;
  }
  .media {
    display: none;
  }
}
</style>
