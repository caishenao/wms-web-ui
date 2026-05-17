<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStockListApi,
  freezeStockApi,
  unfreezeStockApi,
} from '#/api/core/stock';
import { message, Modal } from 'ant-design-vue';
import { ref } from 'vue';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'warehouseName', title: '仓库', width: 120 },
      { field: 'locationCode', title: '库位编码', width: 120 },
      { field: 'materialCode', title: '物料编码', width: 120 },
      { field: 'materialName', title: '物料名称', width: 150 },
      { field: 'batchNo', title: '批次号', width: 120 },
      { field: 'snCode', title: '序列号', width: 120 },
      { field: 'qty', title: '库存数量', width: 100 },
      { field: 'lockedQty', title: '锁定数量', width: 100 },
      { field: 'frozenQty', title: '冻结数量', width: 100 },
      { field: 'availableQty', title: '可用数量', width: 100 },
      {
        field: 'action',
        title: '操作',
        width: 160,
        slots: { default: 'action' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data = await getStockListApi({
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
          { component: 'Input', fieldName: 'materialName', label: '物料名称' },
          { component: 'Input', fieldName: 'batchNo', label: '批次号' },
          { component: 'Input', fieldName: 'snCode', label: '序列号' },
        ],
        submitOnChange: false,
        wrapperClass: 'grid-cols-3',
      },
    },
  },
});

const freezeModal = ref(false);
const freezeId = ref<number | null>(null);
const freezeQty = ref(0);

function handleFreeze(record: any) {
  freezeId.value = record.id;
  freezeQty.value = 0;
  freezeModal.value = true;
}

async function confirmFreeze() {
  if (freezeQty.value <= 0) {
    message.warning('请输入有效的冻结数量');
    return;
  }
  try {
    await freezeStockApi(freezeId.value!, { qty: freezeQty.value });
    message.success('冻结成功');
    freezeModal.value = false;
    gridApi.query();
  } catch {
    message.error('冻结失败');
  }
}

function handleUnfreeze(record: any) {
  Modal.confirm({
    title: '确认解冻',
    content: `确定要解冻该库存吗？当前冻结数量: ${record.frozenQty}`,
    onOk: async () => {
      await unfreezeStockApi(record.id, { qty: record.frozenQty });
      message.success('解冻成功');
      gridApi.query();
    },
  });
}
</script>

<template>
  <Page>
    <Grid>
      <template #action="{ row }">
        <a-button type="link" @click="handleFreeze(row)">冻结</a-button>
        <a-button
          v-if="row.frozenQty > 0"
          type="link"
          @click="handleUnfreeze(row)"
          >解冻</a-button
        >
      </template>
    </Grid>
    <a-modal
      v-model:open="freezeModal"
      title="冻结库存"
      width="400px"
      @ok="confirmFreeze"
    >
      <div class="p-4">
        <a-input-number
          v-model:value="freezeQty"
          :min="0"
          placeholder="请输入冻结数量"
          style="width: 100%"
        />
      </div>
    </a-modal>
  </Page>
</template>
