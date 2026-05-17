import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:database',
      order: 20,
      title: $t('page.wms.basic.title'),
    },
    name: 'WmsBasic',
    path: '/wms/basic',
    children: [
      {
        name: 'WmsMaterialCategory',
        path: '/wms/basic/material-category',
        component: () => import('#/views/material-category/index.vue'),
        meta: { title: $t('page.wms.basic.materialCategory') },
      },
      {
        name: 'WmsMaterial',
        path: '/wms/basic/material',
        component: () => import('#/views/material/index.vue'),
        meta: { title: $t('page.wms.basic.material') },
      },
      {
        name: 'WmsSupplier',
        path: '/wms/basic/supplier',
        component: () => import('#/views/supplier/index.vue'),
        meta: { title: $t('page.wms.basic.supplier') },
      },
      {
        name: 'WmsCustomer',
        path: '/wms/basic/customer',
        component: () => import('#/views/customer/index.vue'),
        meta: { title: $t('page.wms.basic.customer') },
      },
    ],
  },
];

export default routes;
