import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'WmsTransferOrder',
    path: '/wms/transfer-order',
    component: () => import('#/views/transfer-order/index.vue'),
    meta: {
      icon: 'lucide:arrow-left-right',
      order: 25,
      title: $t('page.wms.transfer.order'),
    },
  },
];

export default routes;
