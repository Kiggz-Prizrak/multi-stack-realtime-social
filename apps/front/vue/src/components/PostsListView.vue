<template>
  <ul class="postContainer">

    <!-- <p>{{ posts }}</p> -->
    <ul>
      <li>
        <Post
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @getAllPosts="$emit('getAllPosts')"
        />
      </li>
    </ul>
  </ul>
</template>

<script>
import Post from '@/components/PostView.vue';

export default {
  name: 'PostsList',
  components: {
    Post,
  },
  props: {
    posts: Array,
  },
};
</script>

<style scoped lang="scss">
.postContainer {
  padding: 0px;
}
ul {
  margin: 0%;
  padding: 0%;
  list-style: none;
}
</style>
