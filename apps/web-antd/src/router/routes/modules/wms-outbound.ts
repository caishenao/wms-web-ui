import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'WmsOutboundOrder',
    path: '/wms/outbound-order',
    component: () => import('#/views/outbound-order/index.vue'),
    meta: {
      icon: 'lucide:log-out',
      order: 23,
      title: $t('page.wms.outbound.order'),
    },
  },
];

export default routes;
