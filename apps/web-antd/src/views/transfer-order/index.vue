<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getTransferOrderListApi,
  createTransferOrderApi,
  updateTransferOrderApi,
  deleteTransferOrderApi,
  submitTransferOrderApi,
  auditTransferOrderApi,
} from '#/api/core/transfer-order';
import { getWarehouseListApi } from '#/api/core/warehouse';
import { message, Modal, Tag } from 'ant-design-vue';
import { ref, onMounted, h } from 'vue';

const warehouseOptions = ref<Array<{ label: string; value: number }>>([]);

const statusColorMap: Record<string, string> = {
  DRAFT: 'default',
  PENDING: 'processing',
  AUDITED: 'success',
  IN_TRANSIT: 'warning',
  COMPLETED: 'cyan',
  CANCELLED: 'error',
};

const statusLabelMap: Record<string, string> = {
  DRAFT: '草稿',
  PENDING: '待审核',
  AUDITED: '已审核',
  IN_TRANSIT: '在途',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

onMounted(async () => {
  try {
    const res = await getWarehouseListApi({ page: 1, size: 1000 });
    warehouseOptions.value = (res.items || []).map((w: any) => ({
      label: w.warehouseName,
      value: w.id,
    }));
  } catch {
    // ignore
  }
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'orderNo', title: '调拨单号', width: 160 },
      { field: 'fromWarehouseId', title: '源仓库', width: 120 },
      { field: 'toWarehouseId', title: '目标仓库', width: 120 },
      {
        field: 'orderStatus',
        title: '状态',
        width: 100,
        slots: {
          default: ({ row }: any) => {
            return h(
              Tag,
              { color: statusColorMap[row.orderStatus] || 'default' },
              () => statusLabelMap[row.orderStatus] || row.orderStatus,
            );
          },
        },
      },
      { field: 'createTime', title: '创建时间', width: 160 },
      { field: 'remark', title: '备注' },
      {
        field: 'action',
        title: '操作',
        width: 280,
        slots: { default: 'action' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data = await getTransferOrderListApi({
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
          { component: 'Input', fieldName: 'orderNo', label: '调拨单号' },
          {
            component: 'Select',
            fieldName: 'fromWarehouseId',
            label: '源仓库',
            componentProps: { options: warehouseOptions },
          },
          {
            component: 'Select',
            fieldName: 'toWarehouseId',
            label: '目标仓库',
            componentProps: { options: warehouseOptions },
          },
          {
            component: 'Select',
            fieldName: 'orderStatus',
            label: '状态',
            componentProps: {
              options: [
                { label: '草稿', value: 'DRAFT' },
                { label: '待审核', value: 'PENDING' },
                { label: '已审核', value: 'AUDITED' },
                { label: '在途', value: 'IN_TRANSIT' },
                { label: '已完成', value: 'COMPLETED' },
                { label: '已取消', value: 'CANCELLED' },
              ],
            },
          },
        ],
        submitOnChange: false,
        wrapperClass: 'grid-cols-2',
      },
    },
  },
});

const showModal = ref(false);
const editingId = ref<number | null>(null);
const isEdit = ref(false);

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'orderNo',
      label: '调拨单号',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'fromWarehouseId',
      label: '源仓库',
      rules: 'required',
      componentProps: { options: warehouseOptions },
    },
    {
      component: 'Select',
      fieldName: 'toWarehouseId',
      label: '目标仓库',
      rules: 'required',
      componentProps: { options: warehouseOptions },
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    try {
      if (isEdit.value && editingId.value) {
        await updateTransferOrderApi(editingId.value, values);
        message.success('修改成功');
      } else {
        await createTransferOrderApi(values);
        message.success('新增成功');
      }
      showModal.value = false;
      gridApi.query();
    } catch {
      message.error('操作失败');
    }
  },
  showDefaultActions: true,
});

function handleAdd() {
  isEdit.value = false;
  editingId.value = null;
  formApi.resetForm();
  showModal.value = true;
}

function handleEdit(record: any) {
  isEdit.value = true;
  editingId.value = record.id;
  formApi.setValues(record);
  showModal.value = true;
}

function handleDelete(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除调拨单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await deleteTransferOrderApi(record.id);
      message.success('删除成功');
      gridApi.query();
    },
  });
}

function handleSubmit(record: any) {
  Modal.confirm({
    title: '确认提交',
    content: `确定要提交调拨单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await submitTransferOrderApi(record.id);
      message.success('提交成功');
      gridApi.query();
    },
  });
}

function handleAudit(record: any) {
  Modal.confirm({
    title: '确认审核',
    content: `确定要审核通过调拨单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await auditTransferOrderApi(record.id, { result: 'PASS' });
      message.success('审核成功');
      gridApi.query();
    },
  });
}
</script>

<template>
  <Page>
    <Grid>
      <template #toolbar-actions>
        <a-button type="primary" @click="handleAdd">新增调拨单</a-button>
      </template>
      <template #action="{ row }">
        <a-button
          v-if="row.orderStatus === 'DRAFT'"
          type="link"
          @click="handleEdit(row)"
          >编辑</a-button
        >
        <a-button
          v-if="row.orderStatus === 'DRAFT'"
          type="link"
          @click="handleSubmit(row)"
          >提交</a-button
        >
        <a-button
          v-if="row.orderStatus === 'PENDING'"
          type="link"
          @click="handleAudit(row)"
          >审核</a-button
        >
        <a-button type="link" @click="handleEdit(row)">查看</a-button>
        <a-button
          v-if="row.orderStatus === 'DRAFT'"
          type="link"
          danger
          @click="handleDelete(row)"
          >删除</a-button
        >
      </template>
    </Grid>
    <a-modal
      v-model:open="showModal"
      :title="isEdit ? '编辑调拨单' : '新增调拨单'"
      width="600px"
    >
      <Form />
    </a-modal>
  </Page>
</template>
