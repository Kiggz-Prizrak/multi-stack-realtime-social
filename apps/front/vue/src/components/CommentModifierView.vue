<template>
  <form @submit.prevent="sendComment">
    <div class="blockLabel">
      <label class="labelForm" for="textarea">
        <input
          v-model="commentContent"
          :placeholder="comment.content"
          type="textarea"
          id="commentContent"
        />
      </label>
      <input
        v-on:click="deleteMedia = !deleteMedia"
        class="mediaSuppressor"
        type="button"
        value="Retirer le média du commentaire"
      />
      <label v-if="!deleteMedia" class="labelMedia" for="media">
        <span id="iconMedia"><i class="fas fa-images"></i></span>
        <input
          class="media"
          type="file"
          id="modifierMedia"
          name="media"
          accept="image/png, image/jpeg"
        />
      </label>
    </div>

    <input id="submitComment" type="submit" value="MODIFIER" />
  </form>
</template>

<script>
export default {
  name: 'CommentModifier',
  props: {
    comment: Object,
  },
  watch: {
    comment: {
      handler(newCommentProp) {
        this.commentContent = newCommentProp.content;
      },
      immediate: true,
    },
  },
  data() {
    return {
      deleteMedia: false,
      commentContent: '',
    };
  },
  methods: {
    updateCommentWithMedia() {
      const newComment = new FormData();
      newComment.append('content', this.commentContent);
      newComment.append('media', document.getElementById('modifierMedia').files[0]);

      console.log(document.getElementById('modifierMedia').value);

      fetch(`http://localhost:3000/api/comments/${this.comment.id}`, {
        body: newComment,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditComment');
          this.$emit('getAllPosts');
        });
    },
    updateCommentWithoutMedia() {
      const newComment = JSON.stringify({
        content: this.commentContent,
        media: null,
      });
      fetch(`http://localhost:3000/api/comments/${this.comment.id}`, {
        body: newComment,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditcomment');
          this.$emit('getAllPosts');
        });
    },
    updateCommentKeepMedia() {
      const newComment = JSON.stringify({
        content: this.commentContent,
      });
      fetch(`http://localhost:3000/api/comments/${this.comment.id}`, {
        body: newComment,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('toggleEditComment');
          this.$emit('getAllPosts');
        });
    },
    sendComment() {
      if (this.deleteMedia === true) {
        return this.updateCommentWithoutMedia();
      }
      if (document.getElementById('modifierMedia').files[0]) {
        return this.updateCommentWithMedia();
      }
      return this.updateCommentKeepMedia();
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
#commentContent {
  background-color: transparent;
  border: none;
  width: 100%;
  &:focus-visible {
    border: none;
  }
}
#submitComment {
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
