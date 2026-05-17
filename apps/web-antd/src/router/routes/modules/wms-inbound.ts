import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'WmsInboundOrder',
    path: '/wms/inbound-order',
    component: () => import('#/views/inbound-order/index.vue'),
    meta: {
      icon: 'lucide:log-in',
      order: 22,
      title: $t('page.wms.inbound.order'),
    },
  },
];

export default routes;
