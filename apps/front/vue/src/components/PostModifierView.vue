<template>
  <form @submit.prevent="sendPost">
    <div class="blockLabel">
      <label class="labelForm" for="textarea">
        <input
        v-model="postContent"
        :placeholder="post.content"
         type="textarea"
         id="postContent"
         />
      </label>
      <input
        v-on:click="deleteMedia = !deleteMedia"
        class="mediaSuppressor"
        type="button"
        value="Retirer le média du post"
      />
      <label v-if="!deleteMedia" class="labelMedia" for="media">
        <span id="iconMedia"><i class="fas fa-images"></i></span>
        <input
          class="media"
          type="file"
          id="modifierMedia"
          name="media"
          accept="image/png, image/gif, image/jpeg"
        />
      </label>
    </div>

    <input id="submitPost" type="submit" value="MODIFIER" />
  </form>
</template>

<script>
export default {
  name: 'PostModifier',
  props: {
    post: Object,
    UserId: {
      type: Number,
      required: true,
    },
  },
  watch: {
    post: {
      handler(newPostProp) {
        this.postContent = newPostProp.content;
      },
      immediate: true,
    },
  },
  data() {
    return {
      deleteMedia: false,
      postContent: '',
    };
  },
  methods: {
    updatePostWithMedia() {
      const newPost = new FormData();
      newPost.append('content', this.postContent);
      newPost.append('media', document.getElementById('modifierMedia').files[0]);

      console.log(document.getElementById('modifierMedia').value);

      fetch(`http://localhost:3000/api/posts/${this.post.id}`, {
        body: newPost,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditPost');
          this.$emit('getAllPosts');
        });
    },
    updatePostWithoutMedia() {
      const newPost = JSON.stringify({
        content: this.postContent,
        media: null,
      });
      fetch(`http://localhost:3000/api/posts/${this.post.id}`, {
        body: newPost,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditPost');
          this.$emit('getAllPosts');
        });
    },
    updatePostKeepMedia() {
      const newPost = JSON.stringify({
        content: this.postContent,
      });
      fetch(`http://localhost:3000/api/posts/${this.post.id}`, {
        body: newPost,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditPost');
          this.$emit('getAllPosts');
        });
    },
    sendPost() {
      if (this.deleteMedia === true) {
        return this.updatePostWithoutMedia();
      }
      if (document.getElementById('modifierMedia').files[0]) {
        return this.updatePostWithMedia();
      }
      return this.updatePostKeepMedia();
    },
  },
};
</script>

<style scoped lang="scss">
#iconMedia {
  margin: 0px;
}
form {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  margin: 20px 0px;
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
  width: 100%;
  &:focus-visible {
    border: none;
  }
}
#submitPost {
  border-radius: 10px;
  border: solid 2px #3f3f3f;
  height: 40px;
  width: 20%;
  background-color: #d1515a;
  color: #3f3f3f;
  font-weight: bold;
  font-size: 16px;
}

.mediaSuppressor {
  display: flex;
  flex-direction: flex-start;
  margin-bottom: 10px;
}

.labelMedia {
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

.mediaSuppressor {
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 3px;
  margin: 5px 0px;
  &:active {
    background-color: #d1515a;
  }
}
</style>
