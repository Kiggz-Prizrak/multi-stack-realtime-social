<template>
  <div class="post">
    <div class="postHeader">
      <div class="postHeaderInfo">
        <img class="postUserAvatar" :src="post.User.avatar" alt="avatar de l'user" />
        <div class="postUserData">
          <router-link :to="{ name: 'profil', params: { UserId: post.UserId } }">
            <h3 id="userName">{{ post.User.username }}</h3>
          </router-link>
          <p>{{ this.dateCreation() }}</p>
        </div>
      </div>
      <div>
        <ParamsView
          :postUserId="post.UserId"
          :postId="post.id"
          @getAllPosts="$emit('getAllPosts')"
          @toggleEditPost="toggleEditPost"
          :post="post"
        />
      </div>
    </div>
    <!-- contenu du post -->
    <div class="postContent" v-if="this.editPost === false">
      <p id="postContent">{{ post.content }}</p>
      <img class="media" v-if="post.media" :src="this.post.media" alt="avatar de l'utilisateur" />
    </div>
    <!-- fin - contenu du post -->

    <!-- Modificateur du post -->

    <PostModifier
      :post="post"
      v-if="this.editPost === true"
      @toggleEditPost="toggleEditPost"
      @getAllPosts="$emit('getAllPosts')"
    />

    <hr />

    <div class="postFooter">
      <input v-on:click="isHidden = !isHidden" class="comment" type="submit" value="Commenter" />
      <Reactions
      :reactions="post.Reactions"
      :id="post.id"
      :elementReacted="elementReacted"
      @getAllPosts="$emit('getAllPosts')"
      />
    </div>

    <div v-if="!isHidden" class="commentContainer">
      <AddComment :postId="post.id" @getAllPosts="$emit('getAllPosts')" />
      <CommentsList
        :Comments="post.Comments"
        :postId="post.id"
        @getAllPosts="$emit('getAllPosts')"
        @toggleEditPost="toggleEditPost"
      />
    </div>
  </div>
</template>

<script>
import AddComment from './AddCommentView.vue';
import CommentsList from './CommentsListView.vue';
import ParamsView from './ParamsView.vue';
import Reactions from './ReactionsView.vue';
import PostModifier from './PostModifierView.vue';

export default {
  name: 'PostView',
  components: {
    ParamsView,
    CommentsList,
    AddComment,
    Reactions,
    PostModifier,
  },
  props: {
    post: Object,
  },
  methods: {
    toggleEditPost() {
      this.editPost = !this.editPost;
    },
    dateCreation() {
      const stamp = this.post.createdAt;
      const date = new Date(stamp);
      const years = date.getFullYear();
      const months = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Le ${day}/${months}/${years} à ${hours}h${minutes}`;
    },
  },
  data() {
    return {
      isHidden: true,
      editPost: false,
      elementReacted: 'posts',
    };
  },
};
</script>

<style scoped lang="scss">
.postUserAvatar {
  width: 40px;
  border-radius: 100px;
}
.post {
  position: relative;
  background-color: #d7d7d7d8;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0px;
  border: solid 1px black;
  width: 100%;
  .postHeader {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  .postHeaderInfo {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .postUserAvatar {
      width: 40px;
      height: 40px;
      border-radius: 100px;
      display: flex;
    }
    .postUserData {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: baseline;
      h3 {
        margin: 5px;
        color: #d1515a;
        font-weight: bold;
        text-decoration: none;
      }
      p {
        margin: 5px;
        color: #3f3f3f;
      }
    }
  }
  hr {
    margin: 10px;
  }
  p {
    text-align: start;
  }
  img {
    width: 100%;
    object-fit: contain;
  }
  .postFooter {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap-reverse;
    .comment {
      background-color: transparent;
      font-weight: bold;
      border: none;
      color: #3f3f3f;
      font-size: 18px;
      border-radius: 10px;
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 10px;
      &:active {
        background-color: #091f43;
        color: #d7d7d7d8;
      }
    }
  }
}
</style>
