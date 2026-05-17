<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getInboundOrderListApi,
  createInboundOrderApi,
  updateInboundOrderApi,
  deleteInboundOrderApi,
  submitInboundOrderApi,
  auditInboundOrderApi,
} from '#/api/core/inbound-order';
import { getWarehouseListApi } from '#/api/core/warehouse';
import { message, Modal, Tag } from 'ant-design-vue';
import { ref, onMounted, h } from 'vue';

const warehouseOptions = ref<Array<{ label: string; value: number }>>([]);

const statusColorMap: Record<string, string> = {
  DRAFT: 'default',
  PENDING: 'processing',
  AUDITED: 'success',
  CANCELLED: 'error',
};

const statusLabelMap: Record<string, string> = {
  DRAFT: '草稿',
  PENDING: '待审核',
  AUDITED: '已审核',
  CANCELLED: '已取消',
};

const inboundTypeOptions = [
  { label: '采购入库', value: 'PURCHASE' },
  { label: '生产入库', value: 'PRODUCTION' },
  { label: '退货入库', value: 'RETURN' },
  { label: '调拨入库', value: 'TRANSFER' },
  { label: '其他入库', value: 'OTHER' },
];

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
      { field: 'orderNo', title: '入库单号', width: 160 },
      { field: 'inboundType', title: '入库类型', width: 100 },
      { field: 'warehouseId', title: '仓库', width: 120 },
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
          const data = await getInboundOrderListApi({
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
          { component: 'Input', fieldName: 'orderNo', label: '入库单号' },
          {
            component: 'Select',
            fieldName: 'inboundType',
            label: '入库类型',
            componentProps: { options: inboundTypeOptions },
          },
          {
            component: 'Select',
            fieldName: 'warehouseId',
            label: '仓库',
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
      label: '入库单号',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'inboundType',
      label: '入库类型',
      rules: 'required',
      componentProps: { options: inboundTypeOptions },
    },
    {
      component: 'Select',
      fieldName: 'warehouseId',
      label: '目标仓库',
      rules: 'required',
      componentProps: { options: warehouseOptions },
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    try {
      if (isEdit.value && editingId.value) {
        await updateInboundOrderApi(editingId.value, values);
        message.success('修改成功');
      } else {
        await createInboundOrderApi(values);
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
    content: `确定要删除入库单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await deleteInboundOrderApi(record.id);
      message.success('删除成功');
      gridApi.query();
    },
  });
}

function handleSubmit(record: any) {
  Modal.confirm({
    title: '确认提交',
    content: `确定要提交入库单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await submitInboundOrderApi(record.id);
      message.success('提交成功');
      gridApi.query();
    },
  });
}

function handleAudit(record: any) {
  Modal.confirm({
    title: '确认审核',
    content: `确定要审核通过入库单 "${record.orderNo}" 吗？`,
    onOk: async () => {
      await auditInboundOrderApi(record.id, { result: 'PASS' });
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
        <a-button type="primary" @click="handleAdd">新增入库单</a-button>
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
      :title="isEdit ? '编辑入库单' : '新增入库单'"
      width="600px"
    >
      <Form />
    </a-modal>
  </Page>
</template>
