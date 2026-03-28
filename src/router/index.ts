import { createRouter, createWebHistory } from 'vue-router'
import { getAppBaseUrl } from '@/utils/resolvePublicUrl'

export const router = createRouter({
  history: createWebHistory(getAppBaseUrl()),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: () => import('@/views/MenuView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/SceneView.vue'),
    },
    {
      path: '/scene',
      redirect: { name: 'game' },
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/views/EditorView.vue'),
      beforeEnter: (_to, _from, next) => {
        if (import.meta.env.DEV) next()
        else next({ path: '/' })
      },
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('@/views/SandboxView.vue'),
      beforeEnter: (_to, _from, next) => {
        if (import.meta.env.DEV) next()
        else next({ path: '/' })
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
