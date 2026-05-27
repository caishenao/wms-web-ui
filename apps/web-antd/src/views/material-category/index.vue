<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getMaterialCategoryListApi,
  createMaterialCategoryApi,
  updateMaterialCategoryApi,
  deleteMaterialCategoryApi,
} from '#/api/core/material-category';
import { message, Modal } from 'ant-design-vue';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'categoryCode', title: '分类编码', width: 150 },
      { field: 'categoryName', title: '分类名称', width: 150 },
      { field: 'categoryLevel', title: '层级', width: 80 },
      { field: 'sortOrder', title: '排序', width: 80 },
      { field: 'status', title: '状态', width: 80 },
      { field: 'remark', title: '备注' },
      { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data = await getMaterialCategoryListApi({
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
          { component: 'Input', fieldName: 'categoryName', label: '分类名称' },
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
      fieldName: 'categoryCode',
      label: '分类编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'categoryName',
      label: '分类名称',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: '排序号',
      defaultValue: 0,
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    const data = drawerApi.getData<{ isEdit?: boolean; editingId?: number }>();
    try {
      if (data.isEdit && data.editingId) {
        await updateMaterialCategoryApi(data.editingId, values);
        message.success('修改成功');
      } else {
        await createMaterialCategoryApi(values);
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
    content: `确定要删除分类 "${record.categoryName}" 吗？`,
    onOk: async () => {
      await deleteMaterialCategoryApi(record.id);
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
        <a-button type="primary" @click="handleAdd">新增分类</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <a-button type="link" danger @click="handleDelete(row)">删除</a-button>
      </template>
    </Grid>
    <Drawer cancel-text="取消" confirm-text="确定" title="物料分类">
      <Form />
    </Drawer>
  </Page>
</template>
