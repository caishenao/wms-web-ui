<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getWarehouseAreaListApi,
  createWarehouseAreaApi,
  updateWarehouseAreaApi,
  deleteWarehouseAreaApi,
} from '#/api/core/warehouse-area';
import { getWarehouseListApi } from '#/api/core/warehouse';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted } from 'vue';

const warehouseOptions = ref<Array<{ label: string; value: number }>>([]);

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
      { field: 'areaCode', title: '库区编码', width: 120 },
      { field: 'areaName', title: '库区名称', width: 150 },
      { field: 'warehouseId', title: '所属仓库', width: 120 },
      { field: 'areaType', title: '库区类型', width: 100 },
      { field: 'status', title: '状态', width: 80 },
      { field: 'remark', title: '备注' },
      {
        field: 'action',
        title: '操作',
        width: 200,
        slots: { default: 'action' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data = await getWarehouseAreaListApi({
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
          { component: 'Input', fieldName: 'areaName', label: '库区名称' },
          {
            component: 'Select',
            fieldName: 'warehouseId',
            label: '所属仓库',
            componentProps: { options: warehouseOptions },
          },
          {
            component: 'Select',
            fieldName: 'status',
            label: '状态',
            componentProps: {
              options: [
                { label: '启用', value: 'ENABLED' },
                { label: '停用', value: 'DISABLED' },
              ],
            },
          },
        ],
        submitOnChange: false,
        wrapperClass: 'grid-cols-3',
      },
    },
  },
});

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'areaCode',
      label: '库区编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'areaName',
      label: '库区名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'warehouseId',
      label: '所属仓库',
      rules: 'required',
      componentProps: { options: warehouseOptions },
    },
    {
      component: 'Select',
      fieldName: 'areaType',
      label: '库区类型',
      componentProps: {
        options: [
          { label: '存储区', value: 'STORAGE' },
          { label: '拣货区', value: 'PICKING' },
          { label: '收货区', value: 'RECEIVING' },
          { label: '发货区', value: 'SHIPPING' },
          { label: '退货区', value: 'RETURN' },
        ],
      },
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    const data = drawerApi.getData<{ isEdit?: boolean; editingId?: number }>();
    try {
      if (data.isEdit && data.editingId) {
        await updateWarehouseAreaApi(data.editingId, values);
        message.success('修改成功');
      } else {
        await createWarehouseAreaApi(values);
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
    content: `确定要删除库区 "${record.areaName}" 吗？`,
    onOk: async () => {
      await deleteWarehouseAreaApi(record.id);
      message.success('删除成功');
      gridApi.query();
    },
  });
}
</script>

<template>
  <Page>
    <Grid>
      <template #toolbar-actions>
        <a-button type="primary" @click="handleAdd">新增库区</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <a-button type="link" danger @click="handleDelete(row)">删除</a-button>
      </template>
    </Grid>
    <Drawer cancel-text="取消" confirm-text="确定" title="库区信息">
      <Form />
    </Drawer>
  </Page>
</template>
