import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardAdminView from '../views/DashboardAdminView.vue';
import SignupView from '../views/SignupView.vue';
import ProfilView from '../views/ProfilView.vue';
import AccueilView from '../views/AccueilView.vue';
import EditProfilView from '../views/EditProfilView.vue';
import ElementView from '../views/ElementView.vue';
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      auth: false,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      auth: false,
    },
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardAdminView,
    meta: {
      auth: true,
      isAdmin: true,
    },
  },
  {
    path: '/profil/:UserId',
    name: 'profil',
    component: ProfilView,
    props(route) {
      const UserId = Number.parseInt(route.params.UserId, 10);
      if (Number.isNaN(UserId)) {
        return 0;
      }
      return { UserId };
    },
    meta: {
      auth: true,
    },
  },
  {
    path: '/editprofil/:UserId',
    name: 'editprofil',
    component: EditProfilView,
    props(route) {
      const UserId = Number.parseInt(route.params.UserId, 10);
      if (Number.isNaN(UserId)) {
        return 0;
      }
      return { UserId };
    },
    meta: {
      auth: true,
    },
  },
  {
    path: '/posts/:PostId',
    name: 'post',
    component: ElementView,
    props(route) {
      const PostId = Number.parseInt(route.params.PostId, 10);
      if (Number.isNaN(PostId)) {
        return 0;
      }
      return { PostId };
    },
    meta: {
      auth: true,
    },
  },
  {
    path: '/comments/:CommentId',
    name: 'comment',
    component: ElementView,
    props(route) {
      const CommentId = Number.parseInt(route.params.CommentId, 10);
      if (Number.isNaN(CommentId)) {
        return 0;
      }
      return { CommentId };
    },
    meta: {
      auth: true,
    },
  },
  {
    path: '/',
    name: 'accueil',
    component: AccueilView,
    meta: {
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.state.token) {
    return next({
      name: 'login',
    });
  }
  if (to.meta.isAdmin && !store.state.user.isAdmin) {
    return next({
      name: 'login',
    });
  }
  return next();
});

export default router;
