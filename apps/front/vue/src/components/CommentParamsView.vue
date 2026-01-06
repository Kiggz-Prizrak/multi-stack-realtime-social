<template>
  <div class="params">
    <input
      v-if="
        this.$store.state.user.id === this.commentUserId || this.$store.state.user.isAdmin === true
      "
      id="deleteComment"
      class="commentOptions"
      type="submit"
      value="Suprimer"
      @click="deleteComment"
    />
    <input
      v-if="this.$store.state.user.id === this.commentUserId"
      id="changeComment"
      class="commentOptions"
      type="submit"
      value="Modifier"
      :comment="comment"
      v-on:click="this.$emit('toggleEditComment')"
    />
    <input
      v-if="this.$store.state.user.id !== this.commentUserId"
      id="changeComment"
      class="commentOptions"
      type="submit"
      value="Report"
    />
    <span id="iconCommentParams"><i class="fas fa-ellipsis-v"></i></span>
  </div>
</template>

<script>
export default {
  name: 'CommentParamsView',
  props: {
    commentUserId: Number,
    commentId: Number,
    comment: Object,
  },
  ddata() {
    return {
      reportBody: {},
    };
  },
  methods: {
    deleteComment() {
      fetch(`http://localhost:3000/api/comments/${this.commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.$emit('getAllPosts'));
    },
    reportComment() {
      this.reportBody = {
        PostId: null,
        CommentId: this.commentId,
      };
      fetch('http://localhost:3000/api/reports', {
        body: JSON.stringify(this.reportBody),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => this.$emit('getAllPosts'));
    },
  },

};
</script>

<style scoped lang="scss">
.params {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  input {
    cursor: pointer;
    padding: 10px;
    background-color: transparent;
    text-decoration: none;
    border: none;
    border-right: 1px solid #d7d7d7d8;
    color: #d7d7d7d8;
    display: none;
  }
  .commentOptions {
    width: 100%;
  }
  #iconCommentParams {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #3f3f3f;
    padding: 10px;
    font-weight: bold;
  }
  &:hover {
    background-color: #091f43;
    #iconCommentParams {
      color: #d7d7d7d8;
    }
    .commentOptions {
      display: block;
    }
  }
}
</style>
