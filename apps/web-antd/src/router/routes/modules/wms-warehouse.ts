import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:warehouse',
      order: 21,
      title: $t('page.wms.warehouse.title'),
    },
    name: 'WmsWarehouse',
    path: '/wms/warehouse',
    children: [
      {
        name: 'WmsWarehouseManage',
        path: '/wms/warehouse/warehouse',
        component: () => import('#/views/warehouse/index.vue'),
        meta: { title: $t('page.wms.warehouse.warehouse') },
      },
      {
        name: 'WmsWarehouseArea',
        path: '/wms/warehouse/area',
        component: () => import('#/views/warehouse-area/index.vue'),
        meta: { title: $t('page.wms.warehouse.area') },
      },
      {
        name: 'WmsWarehouseLocation',
        path: '/wms/warehouse/location',
        component: () => import('#/views/warehouse-location/index.vue'),
        meta: { title: $t('page.wms.warehouse.location') },
      },
    ],
  },
];

export default routes;
