<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStockTransactionListApi } from '#/api/core/stock-transaction';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';

const changeTypeOptions = [
  { label: '入库', value: 'INBOUND' },
  { label: '出库', value: 'OUTBOUND' },
  { label: '调拨入', value: 'TRANSFER_IN' },
  { label: '调拨出', value: 'TRANSFER_OUT' },
  { label: '盘盈', value: 'PROFIT' },
  { label: '盘亏', value: 'LOSS' },
  { label: '冻结', value: 'FREEZE' },
  { label: '解冻', value: 'UNFREEZE' },
];

const changeTypeColorMap: Record<string, string> = {
  INBOUND: 'green',
  OUTBOUND: 'red',
  TRANSFER_IN: 'blue',
  TRANSFER_OUT: 'orange',
  PROFIT: 'cyan',
  LOSS: 'magenta',
  FREEZE: 'default',
  UNFREEZE: 'processing',
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'transactionNo', title: '流水号', width: 160 },
      {
        field: 'changeType',
        title: '变动类型',
        width: 100,
        slots: {
          default: ({ row }: any) => {
            const item = changeTypeOptions.find(
              (o) => o.value === row.changeType,
            );
            return h(
              Tag,
              { color: changeTypeColorMap[row.changeType] || 'default' },
              () => item?.label || row.changeType,
            );
          },
        },
      },
      { field: 'sourceType', title: '来源类型', width: 100 },
      { field: 'sourceNo', title: '来源单号', width: 160 },
      { field: 'materialName', title: '物料名称', width: 150 },
      { field: 'qtyBefore', title: '变动前数量', width: 100 },
      { field: 'qtyChange', title: '变动数量', width: 100 },
      { field: 'qtyAfter', title: '变动后数量', width: 100 },
      { field: 'createTime', title: '创建时间', width: 160 },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data = await getStockTransactionListApi({
            page: page.currentPage,
            size: page.pageSize,
          });
          return data;
        },
      },
    },
    pagerConfig: { enabled: true },
    formOptions: {
      useVbenForm: {
        schema: [
          { component: 'Input', fieldName: 'transactionNo', label: '流水号' },
          {
            component: 'Select',
            fieldName: 'changeType',
            label: '变动类型',
            componentProps: { options: changeTypeOptions },
          },
          { component: 'Input', fieldName: 'sourceNo', label: '来源单号' },
          { component: 'Input', fieldName: 'materialName', label: '物料名称' },
        ],
        submitOnChange: false,
        wrapperClass: 'grid-cols-2',
      },
    },
  },
});
</script>

<template>
  <Page>
    <Grid />
  </Page>
</template>
