<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getInventoryCheckListApi,
  createInventoryCheckApi,
  updateInventoryCheckApi,
  deleteInventoryCheckApi,
  submitInventoryCheckApi,
  auditInventoryCheckApi,
} from '#/api/core/inventory-check';
import { getWarehouseListApi } from '#/api/core/warehouse';
import { message, Modal, Tag } from 'ant-design-vue';
import { ref, onMounted, h } from 'vue';

const warehouseOptions = ref<Array<{ label: string; value: number }>>([]);

const statusColorMap: Record<string, string> = {
  DRAFT: 'default',
  PENDING: 'processing',
  COUNTING: 'warning',
  AUDITED: 'success',
  CANCELLED: 'error',
};

const statusLabelMap: Record<string, string> = {
  DRAFT: '草稿',
  PENDING: '待盘点',
  COUNTING: '盘点中',
  AUDITED: '已审核',
  CANCELLED: '已取消',
};

const checkTypeOptions = [
  { label: '全盘', value: 'FULL' },
  { label: '抽盘', value: 'SAMPLE' },
  { label: '动态盘点', value: 'DYNAMIC' },
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
      { field: 'checkNo', title: '盘点单号', width: 160 },
      { field: 'warehouseId', title: '仓库', width: 120 },
      { field: 'checkType', title: '盘点类型', width: 100 },
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
          const data = await getInventoryCheckListApi({
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
          { component: 'Input', fieldName: 'checkNo', label: '盘点单号' },
          {
            component: 'Select',
            fieldName: 'warehouseId',
            label: '仓库',
            componentProps: { options: warehouseOptions },
          },
          {
            component: 'Select',
            fieldName: 'checkType',
            label: '盘点类型',
            componentProps: { options: checkTypeOptions },
          },
          {
            component: 'Select',
            fieldName: 'orderStatus',
            label: '状态',
            componentProps: {
              options: [
                { label: '草稿', value: 'DRAFT' },
                { label: '待盘点', value: 'PENDING' },
                { label: '盘点中', value: 'COUNTING' },
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

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'checkNo',
      label: '盘点单号',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'warehouseId',
      label: '盘点仓库',
      rules: 'required',
      componentProps: { options: warehouseOptions },
    },
    {
      component: 'Select',
      fieldName: 'checkType',
      label: '盘点类型',
      rules: 'required',
      componentProps: { options: checkTypeOptions },
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    const data = drawerApi.getData<{ isEdit?: boolean; editingId?: number }>();
    try {
      if (data.isEdit && data.editingId) {
        await updateInventoryCheckApi(data.editingId, values);
        message.success('修改成功');
      } else {
        await createInventoryCheckApi(values);
        message.success('新增成功');
      }
      drawerApi.close();
      gridApi.query();
    } catch {
      message.error('操作失败');
    }
  },
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    await formApi.submitForm();
  },
  onCancel() {
    drawerApi.close();
  },
});

function handleAdd() {
  formApi.resetForm();
  drawerApi.setData({ isEdit: false, editingId: null });
  drawerApi.open();
}

function handleEdit(record: any) {
  formApi.setValues(record);
  drawerApi.setData({ isEdit: true, editingId: record.id });
  drawerApi.open();
}

function handleDelete(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除盘点单 "${record.checkNo}" 吗？`,
    onOk: async () => {
      await deleteInventoryCheckApi(record.id);
      message.success('删除成功');
      gridApi.query();
    },
  });
}

function handleSubmit(record: any) {
  Modal.confirm({
    title: '确认提交',
    content: `确定要提交盘点单 "${record.checkNo}" 吗？`,
    onOk: async () => {
      await submitInventoryCheckApi(record.id);
      message.success('提交成功');
      gridApi.query();
    },
  });
}

function handleAudit(record: any) {
  Modal.confirm({
    title: '确认审核',
    content: `确定要审核通过盘点单 "${record.checkNo}" 吗？`,
    onOk: async () => {
      await auditInventoryCheckApi(record.id, { result: 'PASS' });
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
        <a-button type="primary" @click="handleAdd">新增盘点单</a-button>
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
          v-if="row.orderStatus === 'COUNTING'"
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
    <Drawer cancel-text="取消" confirm-text="确定" title="盘点单信息">
      <Form />
    </Drawer>
  </Page>
</template>
