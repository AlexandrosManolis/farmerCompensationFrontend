import { createRouter, createWebHistory } from 'vue-router'
import { useApplicationStore } from '@/stores/application.js';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersVIew.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/user-details/:id',
      name: 'user-details',
      component: () => import('../views/UserDetailsView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/edit/:id',
      name: 'user-edit',
      component: () => import('../views/EditUserView.vue'),
      meta:{requiresAuth: true}
    },
    {
      path: '/users/:id/user-declarations',
      name: 'user-declarations',
      component: () => import('../views/DeclarationsView.vue'),
      meta:{requiresAuth: true}
    },
    {
      path: '/:userId/declaration-details/:declarationId',
      name: 'declaration-details',
      component: () => import('../views/DeclarationDetailsView.vue'),
      meta:{requiresAuth: true}
    },
    {
      path: '/:userId/edit-declaration/:declarationId',
      name: 'edit-declaration',
      component: () => import('../views/EditDeclaration.vue'),
      meta:{requiresAuth: true}
    },
    {
      path:'/add-declaration/:id/new',
      name:'add-declaration',
      component:() => import('../views/NewDeclarationView.vue'),
      meta:{requiresAuth: true}
    },
    {
      path: '/users/requests',
      name: 'user-requests',
      component: () => import('../views/UserRequestsView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/users/:userId/requestForRole',
      name: 'request-for-role',
      component: () => import('../views/RequestForRole.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/users/:userId/deleteRole/:roleId',
      name: 'delete-role',
      component: () => import('../views/DeleteRoleView.vue'),
      meta: {requiresAuth: true, isAdmin: true}
    },
    {
      path: '/users/:userId/checkOnSite/:declarationId',
      name: 'checkOnSite-report',
      component: () => import('../views/CheckOnSiteReportView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/users/:userId/rejectReport/:declarationId',
      name: 'reject-report',
      component: () => import('../views/RejectReportView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/users/:userId/acceptReport/:declarationId',
      name: 'accept-report',
      component: () => import('../views/AcceptReportView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/users/:userId/delete/:declarationId',
      name: 'delete-declaration',
      component: () => import('../views/DeleteDeclarationView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/admin/users/:userId/rejectUserRequest/:requestId',
      name: 'reject-request',
      component: () => import('../views/RejectUserRequestView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/admin/users/:userId/approveUserRequest/:requestId',
      name: 'approve-request',
      component: () => import('../views/ApproveUserRequestView.vue'),
      meta: {requiresAuth: true}
    }
  ]
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useApplicationStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    console.log('user not authenticated. redirecting to /login');
    next('/login');
  } else {
    next();
  }
});

export default router;
