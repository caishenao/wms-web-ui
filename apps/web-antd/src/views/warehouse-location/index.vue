<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getWarehouseLocationListApi,
  createWarehouseLocationApi,
  updateWarehouseLocationApi,
  deleteWarehouseLocationApi,
} from '#/api/core/warehouse-location';
import { getWarehouseListApi } from '#/api/core/warehouse';
import { getWarehouseAreaListApi } from '#/api/core/warehouse-area';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted } from 'vue';

const warehouseOptions = ref<Array<{ label: string; value: number }>>([]);
const areaOptions = ref<Array<{ label: string; value: number }>>([]);

onMounted(async () => {
  try {
    const warehouseRes = await getWarehouseListApi({ page: 1, size: 1000 });
    warehouseOptions.value = (warehouseRes.items || []).map((w: any) => ({
      label: w.warehouseName,
      value: w.id,
    }));
    const areaRes = await getWarehouseAreaListApi({ page: 1, size: 1000 });
    areaOptions.value = (areaRes.items || []).map((a: any) => ({
      label: a.areaName,
      value: a.id,
    }));
  } catch {
    // ignore
  }
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'locationCode', title: '库位编码', width: 120 },
      { field: 'locationName', title: '库位名称', width: 150 },
      { field: 'warehouseId', title: '所属仓库', width: 120 },
      { field: 'areaId', title: '所属库区', width: 120 },
      { field: 'locationType', title: '库位类型', width: 100 },
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
          const data = await getWarehouseLocationListApi({
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
          { component: 'Input', fieldName: 'locationName', label: '库位名称' },
          {
            component: 'Select',
            fieldName: 'warehouseId',
            label: '所属仓库',
            componentProps: { options: warehouseOptions },
          },
          {
            component: 'Select',
            fieldName: 'areaId',
            label: '所属库区',
            componentProps: { options: areaOptions },
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
        wrapperClass: 'grid-cols-2',
      },
    },
  },
});

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'locationCode',
      label: '库位编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'locationName',
      label: '库位名称',
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
      fieldName: 'areaId',
      label: '所属库区',
      rules: 'required',
      componentProps: { options: areaOptions },
    },
    {
      component: 'Select',
      fieldName: 'locationType',
      label: '库位类型',
      componentProps: {
        options: [
          { label: '普通库位', value: 'NORMAL' },
          { label: '暂存库位', value: 'TEMP' },
          { label: '质检库位', value: 'QC' },
          { label: '退货库位', value: 'RETURN' },
        ],
      },
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    const data = drawerApi.getData<{ isEdit?: boolean; editingId?: number }>();
    try {
      if (data.isEdit && data.editingId) {
        await updateWarehouseLocationApi(data.editingId, values);
        message.success('修改成功');
      } else {
        await createWarehouseLocationApi(values);
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
    content: `确定要删除库位 "${record.locationName}" 吗？`,
    onOk: async () => {
      await deleteWarehouseLocationApi(record.id);
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
        <a-button type="primary" @click="handleAdd">新增库位</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <a-button type="link" danger @click="handleDelete(row)">删除</a-button>
      </template>
    </Grid>
    <Drawer cancel-text="取消" confirm-text="确定" title="库位信息">
      <Form />
    </Drawer>
  </Page>
</template>
