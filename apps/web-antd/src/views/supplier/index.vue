<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSupplierListApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi,
} from '#/api/core/supplier';
import { message, Modal } from 'ant-design-vue';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'supplierCode', title: '供应商编码', width: 150 },
      { field: 'supplierName', title: '供应商名称', width: 180 },
      { field: 'contactPerson', title: '联系人', width: 100 },
      { field: 'contactPhone', title: '联系电话', width: 130 },
      { field: 'address', title: '地址' },
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
          const data = await getSupplierListApi({
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
          { component: 'Input', fieldName: 'supplierName', label: '供应商名称' },
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
      fieldName: 'supplierCode',
      label: '供应商编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商名称',
      rules: 'required',
    },
    { component: 'Input', fieldName: 'contactPerson', label: '联系人' },
    { component: 'Input', fieldName: 'contactPhone', label: '联系电话' },
    { component: 'Textarea', fieldName: 'address', label: '地址' },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    const data = drawerApi.getData<{ isEdit?: boolean; editingId?: number }>();
    try {
      if (data.isEdit && data.editingId) {
        await updateSupplierApi(data.editingId, values);
        message.success('修改成功');
      } else {
        await createSupplierApi(values);
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
    content: `确定要删除供应商 "${record.supplierName}" 吗？`,
    onOk: async () => {
      await deleteSupplierApi(record.id);
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
        <a-button type="primary" @click="handleAdd">新增供应商</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <a-button type="link" danger @click="handleDelete(row)">删除</a-button>
      </template>
    </Grid>
    <Drawer cancel-text="取消" confirm-text="确定" title="供应商信息">
      <Form />
    </Drawer>
  </Page>
</template>
