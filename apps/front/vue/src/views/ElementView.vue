<template>
  <div class="container">
    <Header />
    <Post
      class="element"
      v-if="PostId"
      :key="element.id"
      :post="element"
      @getAllPosts="getElement"
    />
    <Comment
      class="element"
      v-if="CommentId"
      :key="element.id"
      :comment="element"
      @getAllPosts="getElement"
    />
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/FooterView.vue';
import Header from '@/components/HeaderView.vue';
import Post from '@/components/PostView.vue';
import Comment from '@/components/CommentView.vue';

export default {
  name: 'elementView',
  components: {
    Footer,
    Header,
    Post,
    Comment,
  },
  props: {
    PostId: {
      type: Number,
      required: true,
    },
    CommentId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      elementInfos: {},
      element: [],
    };
  },
  methods: {
    ElementType() {
      if (this.PostId) {
        this.elementInfos = {
          type: 'posts',
          id: this.PostId,
        };
      } else if (this.CommentId) {
        this.elementInfos = {
          type: 'comments',
          id: this.CommentId,
        };
      }
    },
    getElement() {
      fetch(`http://localhost:3000/api/${this.elementInfos.type}/${this.elementInfos.id}`, {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((Element) => {
          this.element = Element;
          console.log(Element);
        });
    },
  },
  created() {
    this.ElementType();
    this.getElement();
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-image: url('@/assets/backgroundClair.jpg');
  background-position: top;
  background-size: cover;
  background-attachment: fixed;
}
.element {
  max-width: 750px;
}
</style>
