import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:package',
      order: 24,
      title: $t('page.wms.stock.title'),
    },
    name: 'WmsStock',
    path: '/wms/stock',
    children: [
      {
        name: 'WmsStockCurrent',
        path: '/wms/stock/current',
        component: () => import('#/views/stock/index.vue'),
        meta: { title: $t('page.wms.stock.current') },
      },
      {
        name: 'WmsStockTransaction',
        path: '/wms/stock/transaction',
        component: () => import('#/views/stock-transaction/index.vue'),
        meta: { title: $t('page.wms.stock.transaction') },
      },
    ],
  },
];

export default routes;
