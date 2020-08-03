
export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/home.vue'),
    meta: {
     
    },
    redirect:'content',
    children:[
      {
        path: '/content',
        name: 'content', 
        component: () => import('../views/content/content.vue'),
        meta: {
        
        }
      },
      {
        path: '/index1',
        name: 'index1', 
        component: () => import('../views/content/index1.vue'),
        meta: {
        
        }
      },
      {
        path: '/index2',
        name: 'index2', 
        component: () => import('../views/content/index2.vue'),
        meta: {
        
        }
      },
      {
        path: '/mai',
        name: 'mai', 
        component: () => import('../views/content/mai.vue'),
        meta: {
        
        }
      }
    ]
  },
  
];
