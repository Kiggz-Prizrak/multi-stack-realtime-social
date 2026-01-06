<template>
  <div class="container">
    <Header />
    <div class="postsSection">
      <AddPost @postCreated="getAllPosts" />
      <div class="postContainer">
        <!-- POST TEMPLATE -->

        <PostsList
        :posts="posts"
        @postDeleted="getAllPosts"
        @getAllPosts="getAllPosts"
        />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/FooterView.vue';
import Header from '@/components/HeaderView.vue';
import AddPost from '@/components/AddPostView.vue';
import PostsList from '@/components/PostsListView.vue';

export default {
  name: 'AccueilView',
  components: {
    PostsList,
    Footer,
    Header,
    AddPost,
  },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    getAllPosts() {
      fetch('http://localhost:3000/api/posts', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((postslist) => {
          this.posts = postslist;
        });
    },
  },
  created() {
    this.getAllPosts();
  },
};
</script>

<style scoped lang="scss">
/* .postsSection {
    margin-top: 3%;
  } */
.container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-image: url('@/assets/backgroundClair.jpg');
  background-position: top;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
}
.profilContainer {
  display: flex;
  flex-direction: row;

}
.postsSection {
  max-width:700px;
}

</style>
