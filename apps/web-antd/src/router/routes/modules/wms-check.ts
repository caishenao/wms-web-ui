import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'WmsInventoryCheck',
    path: '/wms/inventory-check',
    component: () => import('#/views/inventory-check/index.vue'),
    meta: {
      icon: 'lucide:clipboard-check',
      order: 26,
      title: $t('page.wms.check.order'),
    },
  },
];

export default routes;
