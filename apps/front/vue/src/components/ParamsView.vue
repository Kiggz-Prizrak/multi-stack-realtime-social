<template>
  <div class="params">
    <input
      v-if="
        this.$store.state.user.id === this.postUserId || this.$store.state.user.isAdmin === true
      "
      id="deletePost"
      class="postOptions"
      type="submit"
      value="Suprimer"
      @click="deletePost"
    />
    <input
      v-if="
        this.$store.state.user.id === this.postUserId || this.$store.state.user.isAdmin === true
      "
      id="changePost"
      class="postOptions"
      type="submit"
      value="Modifier"
      :post="post"
      v-on:click="this.$emit('toggleEditPost')"
    />
    <input
      v-if="this.$store.state.user.id !== this.postUserId"
      id="changePost"
      class="postOptions"
      type="submit"
      value="Report"
       v-on:click="reportPost()"
    />
    <span id="iconPostParams"><i class="fas fa-ellipsis-v"></i></span>
  </div>
</template>

<script>
export default {
  name: 'ParamsView',
  data() {
    return {
      inputModifier: false,
      reportBody: {},
    };
  },
  props: {
    postUserId: Number,
    postId: Number,
    post: Object,
  },
  methods: {
    deletePost() {
      fetch(`http://localhost:3000/api/posts/${this.postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.$emit('getAllPosts'));
    },
    reportPost() {
      this.reportBody = {
        PostId: this.postId,
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
  position: absolute;
  right: 0%;
  margin-right: 10px;
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
  &:active {
    background-color: #3F3F3F;
  }
  .postOptions {
    width: 100%;
  }
  #iconPostParams {
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
    #iconPostParams {
      color: #d7d7d7d8;
    }
    .postOptions {
      display: block;
    }
  }
  &:focus {
    background-color: #091f43;
    #iconPostParams {
      color: #d7d7d7d8;
    }
    .postOptions {
      display: block;
    }
  }
}
</style>
