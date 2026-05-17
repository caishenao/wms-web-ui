<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSupplierListApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi,
} from '#/api/core/supplier';
import { message, Modal } from 'ant-design-vue';
import { ref } from 'vue';

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

const showModal = ref(false);
const editingId = ref<number | null>(null);
const isEdit = ref(false);

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
    try {
      if (isEdit.value && editingId.value) {
        await updateSupplierApi(editingId.value, values);
        message.success('修改成功');
      } else {
        await createSupplierApi(values);
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
    <a-modal
      v-model:open="showModal"
      :title="isEdit ? '编辑供应商' : '新增供应商'"
      width="600px"
    >
      <Form />
    </a-modal>
  </Page>
</template>
