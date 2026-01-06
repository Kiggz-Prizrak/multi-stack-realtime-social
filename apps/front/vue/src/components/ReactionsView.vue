<template>
  <div class="reactionContainer">
    <div class="postReaction">
      <h4>Réactions</h4>
      <span class="iconRotate"><i class="fas fa-caret-down"></i></span>
      <button ref="love" v-on:click="react('love')">
        <i class="fas fa-heart" v-bind:class="{ reacted: verifReactionlove() }"></i>
        {{ loves.length }}
      </button>
      <button ref="like" v-on:click="react('like')">
        <i class="fas fa-thumbs-up" v-bind:class="{ reacted: verifReactionLike() }"></i>
        {{ likes.length }}
      </button>
      <button ref="dislike" v-on:click="react('dislike')">
        <i class="fas fa-thumbs-down" v-bind:class="{ reacted: verifReactionDislike() }"></i>
        {{ dislikes.length }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReactionsView',
  props: {
    reactions: Array,
    id: Number,
    elementReacted: String,
  },
  data() {
    return {
      reacted: null,
      isActive: true,
      reactBody: {},
      // elementLoved: 'love',
      // elementLiked: 'like',
      // elementDisliked: 'dislike',
    };
  },
  computed: {
    likes() {
      return this.reactions.filter((reaction) => reaction.type === 'like');
    },
    loves() {
      return this.reactions.filter((reaction) => reaction.type === 'love');
    },
    dislikes() {
      return this.reactions.filter((reaction) => reaction.type === 'dislike');
    },
    isUserReacted() {
      return this.reactions.find((reaction) => reaction.UserId === this.$store.state.user.id) ?? {};
    },
  },
  methods: {
    verifReactionlove() {
      if (this.isUserReacted.type === 'love') {
        return true;
      }
      return false;
    },
    verifReactionLike() {
      if (this.isUserReacted.type === 'like') {
        return true;
      }
      return false;
    },
    verifReactionDislike() {
      if (this.isUserReacted.type === 'dislike') {
        return true;
      }
      return false;
    },
    //
    ///
    //
    react(typeOfReaction) {
      if (!this.isUserReacted.type) {
        this.addReaction(typeOfReaction);
      } else if (this.isUserReacted.type !== typeOfReaction) {
        this.changeReaction(typeOfReaction);
      } else if (this.isUserReacted.type === typeOfReaction) {
        this.deleteReaction();
      }
    },
    //
    ///
    //
    addReaction(typeOfReaction) {
      if (this.elementReacted === 'posts') {
        this.reactBody = {
          CommentId: null,
          PostId: this.id,
          type: typeOfReaction,
        };
      } else if (this.elementReacted === 'comments') {
        this.reactBody = {
          CommentId: this.id,
          PostId: null,
          type: typeOfReaction,
        };
      }
      fetch('http://localhost:3000/api/reactions', {
        body: JSON.stringify(this.reactBody),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => this.$emit('getAllPosts'));
    },
    //
    changeReaction(typeOfReaction) {
      if (this.elementReacted === 'posts') {
        this.reactBody = {
          CommentId: null,
          PostId: this.id,
          type: typeOfReaction,
        };
      } else if (this.elementReacted === 'comments') {
        this.reactBody = {
          CommentId: this.id,
          PostId: null,
          type: typeOfReaction,
        };
      }
      fetch(`http://localhost:3000/api/reactions/${this.isUserReacted.id}`, {
        body: JSON.stringify(this.reactBody),
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => {
          this.$emit('getAllPosts');
        });
    },
    //
    deleteReaction() {
      fetch(`http://localhost:3000/api/reactions/${this.isUserReacted.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.$emit('getAllPosts'));
    },
  },
};
</script>

<style scoped lang="scss">
.postReaction {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  h4,
  button {
    padding: 10px;
    color: #3f3f3f;
    margin: 0px;
    background-color: transparent;
    border: none;
  }
  .iconReactions {
    display: none;
  }
  .iconRotate {
    transform: rotate(90deg);
  }
  &:hover {
    background-color: #091f43;
    .iconReactions {
      display: block;
    }
    h4,
    button,
    span {
      color: #d7d7d7d8;
      &:active {
        i {
          color: #d1515a;
        }
      }
      &:hover {
        i {
          font-size: 17px;
        }
      }
    }
    .iconRotate {
      transform: rotate(270deg);
    }
  }
  .reacted {
    color: #d1515a;
  }
}
</style>
