<template>
  <form @submit.prevent="sendPost">
    <div class="blockLabel">
      <label class="labelForm" for="textarea">
        <input v-model="postContent" type="textarea" id="postContent" />
        <label for="media">
          <input
            class="media"
            type="file"
            id="media"
            name="media"
            accept="image/png, image/gif, image/jpeg"
          />
          <span id="iconMedia"><i class="fas fa-images"></i></span>
        </label>
      </label>
    </div>

    <input id="submitPost" type="submit" value="PUBLIER" />
  </form>
</template>

<script>
export default {
  name: 'addPost',
  data() {
    return {
      postContent: '',
    };
  },
  components: {},
  methods: {
    sendPost() {
      if (document.getElementById('media').files[0]) {
        const newPost = new FormData();
        newPost.append('content', this.postContent);
        newPost.append('media', document.getElementById('media').files[0]);

        console.log(newPost);

        fetch('http://localhost:3000/api/posts', {
          body: newPost,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
          .then((res) => res.json())
          .then(() => this.$emit('postCreated'));
      } else {
        const newPost = JSON.stringify({
          content: this.postContent,
        });
        fetch('http://localhost:3000/api/posts', {
          body: newPost,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then(() => this.$emit('postCreated'));
      }
    },
  },
};
</script>

<style scoped lang="scss">
#media {
  display: none;
}
#iconMedia {
  margin: 0px;
}
form {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  background-color: #d7d7d7d8;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0px;
  border: solid 1px black;
}
.blockLabel {
  width: 75%;
}
.labelForm {
  background-color: #ffffff;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: solid 2px #3f3f3f;
}
#postContent {
  background-color: transparent;
  border: none;
  width: 90%;
  &:focus-visible {
    border: none;
  }
}
#submitPost {
  border-radius: 10px;
  border: solid 2px #3f3f3f;
  height: 40px;
  background-color: #d1515a;
  color: #3f3f3f;
  font-weight: bold;
  font-size: 16px;
}
</style>
