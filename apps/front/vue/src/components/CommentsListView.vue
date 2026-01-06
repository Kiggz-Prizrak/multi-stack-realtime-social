<template>
<div class="component">
  <!-- Activation de la liste des commentaires -->
  <label for="commentsListActivator" id="commentsListActivator" class="commentsListActivator">
    <input type="submit" value="Liste de commentaire" >
    <i class="fas fa-caret-down"></i>
  </label>
  <div id="commentContainer" class="commentContainer">
    <!-- Comment -->
    <Comment
    v-for="comment in Comments"
    :key="comment.id"
    :comment="comment"
    @getAllPosts="$emit('getAllPosts')"
    />
    <!-- Fin de comment -->
  </div>
</div>
</template>

<script>

import Comment from '@/components/CommentView.vue';

export default {
  name: 'CommentList',
  components: {
    Comment,
  },
  props: {
    Comments: Array,
    postId: Number,
  },
};
</script>

<style scoped lang="scss">

.commentsListActivator {
  padding: 10px;
  margin: 10px;
  input {
    background-color: transparent;
    border: none;
  }
  i {
    transform: rotate(90deg);
  }
  &:active {
    i {
      transform: rotate(0deg);
    }
  }
}
.commentContainer {
  display: block;
  margin-top: 10px;
}
</style>
