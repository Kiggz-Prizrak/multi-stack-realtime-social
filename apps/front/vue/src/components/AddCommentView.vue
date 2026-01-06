<template>
  <hr />
  <form @submit.prevent="sendComment">
    <label class="blockLabel" for="textarea">
      <input v-model="commentContent" type="textarea" id="commentContent" />
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
    <input id="submitComment" type="submit" value="COMMENTER" />
  </form>
  <hr />
</template>

<script>
export default {
  name: 'addComment',
  components: {},
  props: {
    postId: Number,
  },
  methods: {
    sendComment() {
      if (document.getElementById('media').files[0]) {
        const newComment = new FormData();
        newComment.append('content', this.commentContent);
        newComment.append('PostId', this.postId);
        newComment.append('media', document.getElementById('media').files[0]);

        console.log(newComment);

        fetch('http://localhost:3000/api/comments', {
          body: newComment,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
          .then((res) => res.json())
          .then(() => this.$emit('getAllPosts'));
      } else {
        const newPost = JSON.stringify({
          content: this.commentContent,
          PostId: this.postId,
        });
        fetch('http://localhost:3000/api/comments', {
          body: newPost,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then(() => this.$emit('getAllPosts'));
      }
    },
  },
};
</script>

<style scoped lang="scss">
form {
  background-color: #ffffff;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: solid 2px #3f3f3f;
  height: 70px;
}
.blockLabel {
  justify-content: space-between;
  width: 100%;
}
label {
  width: 78%;
}
#commentContent {
  background-color: transparent;
  border: none;
  width: 85%;
  height: 40px;
}
#media {
  margin: 5px;
}
#submitComment {
  border-radius: 10px;
  border: solid 2px #3f3f3f;
  padding: 8px;
  background-color: #d1515a;
  color: #3f3f3f;
  font-weight: bold;
  font-size: 13px;
}
#media {
  display: none;
}
</style>
