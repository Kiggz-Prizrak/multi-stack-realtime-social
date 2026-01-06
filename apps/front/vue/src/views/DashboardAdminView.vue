<template>
  <div class="container">
    <Header />

    <div class="tabContainer">
      <div class="tab">
        <h2>Liste des utilisateurs</h2>
        <EasyDataTable :headers="usersHeaders" :items="users">
          <template #postsCount="{ Posts }">
            <div>
              {{ Posts.length }}
            </div>
          </template>
          <template #commentsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #action="{ id }">
            <div>
              <router-link :to="{ name: 'profil', params: { UserId: id } }">
                <span class="btn">Voir</span>
              </router-link>
              <router-link :to="{ name: 'editprofil', params: { UserId: id } }">
                <span class="btn">Éditer</span>
              </router-link>
              <button @click="deleteUser(id)" class="btn">Supprimer</button>
            </div>
          </template>
        </EasyDataTable>
      </div>

      <div class="tab">
        <h2>Liste des posts</h2>
        <EasyDataTable :headers="postsHeaders" :items="posts">
          <template #postsCount="{ Posts }">
            <div>
              {{ Posts.length }}
            </div>
          </template>
          <template #commentsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #action="{ id }">
            <div>
              <router-link :to="{ name: 'post', params: { PostId: id } }">
                <span class="btn">Voir</span>
              </router-link>
              <button @click="deletePost(id)" class="btn">Supprimer</button>
            </div>
          </template>
        </EasyDataTable>
      </div>

      <div class="tab">
        <h2>Liste des commentaires</h2>
        <EasyDataTable :headers="commentsHeaders" :items="comments">
          <template #postsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #commentsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #action="{ id }">
            <div>
              <router-link :to="{ name: 'comment', params: { CommentId: id } }">
                <span class="btn">Voir</span>
              </router-link>
              <button @click="deleteComment(id)" class="btn">Supprimer</button>
            </div>
          </template>
        </EasyDataTable>
      </div>

      <div class="tab">
        <h2>Liste des reports</h2>
        <EasyDataTable :headers="reportsHeaders" :items="reports">
          <template #postsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #commentsCount="{ Comments }">
            <div>
              {{ Comments.length }}
            </div>
          </template>
          <template #action="{ id }">
            <div>
              <router-link :to="{ name: 'comment', params: { CommentId: id } }">
                <span class="btn">Voir</span>
              </router-link>
              <button @click="deleteComment(id)" class="btn">Supprimer</button>
            </div>
          </template>
        </EasyDataTable>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
// https://github.com/HC200ok/vue3-easy-data-table
import Footer from '@/components/FooterView.vue';
import Header from '@/components/HeaderView.vue';

export default {
  name: 'DashboardAdminView',
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      users: [],
      usersHeaders: [
        {
          text: 'Id',
          value: 'id',
          sortable: true,
        },
        {
          text: "nom d'utilisateur",
          value: 'username' || 'firstName',
          sortable: true,
        },
        {
          text: 'Adresse Email',
          value: 'email',
        },
        {
          text: 'Date de création',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'Posts',
          value: 'postsCount',
        },
        {
          text: 'Comments',
          value: 'commentsCount',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      posts: [],
      postsHeaders: [
        {
          text: 'Id',
          value: 'id',
          sortable: true,
        },
        {
          text: "Id d'utilisateur",
          value: 'UserId' || 'firstName',
          sortable: true,
        },
        {
          text: 'Utilisateur',
          value: 'User',
          sortable: true,
        },
        {
          text: 'Contenu',
          value: 'content',
        },
        {
          text: 'Commentaires',
          value: 'commentsCount',
        },
        {
          text: 'Date de création',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      comments: [],
      commentsHeaders: [
        {
          text: 'Id',
          value: 'id',
          sortable: true,
        },
        {
          text: "Id d'utilisateur",
          value: 'UserId' || 'firstName',
          sortable: true,
        },
        {
          text: 'Id du post',
          value: 'PostId',
          sortable: true,
        },
        {
          text: 'Contenu',
          value: 'content',
        },
        {
          text: 'Date de création',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      reports: [],
      reportsHeaders: [
        {
          text: 'Id',
          value: 'id',
          sortable: true,
        },
        {
          text: "Id d'utilisateur",
          value: 'UserId',
          sortable: true,
        },
        {
          text: 'Id du post',
          value: 'PostId',
          sortable: true,
        },
        {
          text: 'Id du commentaire',
          value: 'CommentId',
          sortable: true,
        },
        {
          text: 'Date de création',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
    };
  },
  methods: {
    getAllUsers() {
      fetch('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((users) => {
          this.users = users;
        });
    },
    deleteUser(id) {
      fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.getAllUsers());
    },
    //
    getAllPosts() {
      fetch('http://localhost:3000/api/posts', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((posts) => {
          this.posts = posts;
        });
    },
    deletePost(id) {
      fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.getAllPosts());
    },
    //
    getAllComments() {
      fetch('http://localhost:3000/api/comments', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((comments) => {
          this.comments = comments;
        });
    },
    deleteComment(id) {
      fetch(`http://localhost:3000/api/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.getAllComments());
    },
    //
    getAllReports() {
      fetch('http://localhost:3000/api/reports', {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then((reports) => {
          this.reports = reports;
        });
    },
    deleteReport(id) {
      fetch(`http://localhost:3000/api/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      })
        .then((res) => res.json())
        .then(() => this.getAllComments());
    },
  },
  //
  ///
  //
  created() {
    this.getAllUsers();
    this.getAllPosts();
    this.getAllComments();
    this.getAllReports();
  },
};
</script>

<style scoped lang="scss">
.tabContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  max-width: 1000px;
  grid-gap: 75px;
}

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

.tab {
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 5px
}
.btn {
  border-radius: 5px;
  border: 1px solid #3f3f3f;
  color: #3f3f3f;
  padding: 5px;
  margin: 4px;
  background-color: #fff;
  cursor: pointer;
  &:hover {
    color: #d1515a;
    font-weight: bold;
  }
}
</style>
