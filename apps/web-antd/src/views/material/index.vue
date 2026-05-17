<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getMaterialListApi,
  createMaterialApi,
  updateMaterialApi,
  deleteMaterialApi,
} from '#/api/core/material';
import { message, Modal } from 'ant-design-vue';
import { ref } from 'vue';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'materialCode', title: '物料编码', width: 120 },
      { field: 'materialName', title: '物料名称', width: 150 },
      { field: 'materialType', title: '物料类型', width: 100 },
      { field: 'specModel', title: '规格型号', width: 120 },
      { field: 'brand', title: '品牌', width: 100 },
      { field: 'baseUnit', title: '基本单位', width: 80 },
      { field: 'status', title: '状态', width: 80 },
      { field: 'enableBatch', title: '启用批次', width: 80 },
      { field: 'enableSn', title: '启用序列号', width: 100 },
      { field: 'enableQuality', title: '启用质检', width: 80 },
      { field: 'enableExpire', title: '启用保质期', width: 100 },
      { field: 'safeStock', title: '安全库存', width: 80 },
      { field: 'minStock', title: '最小库存', width: 80 },
      { field: 'maxStock', title: '最大库存', width: 80 },
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
          const data = await getMaterialListApi({
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
      fieldName: 'materialCode',
      label: '物料编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'materialName',
      label: '物料名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'materialType',
      label: '物料类型',
      componentProps: {
        options: [
          { label: '原材料', value: 'RAW' },
          { label: '半成品', value: 'SEMI' },
          { label: '成品', value: 'FINISHED' },
        ],
      },
    },
    { component: 'Input', fieldName: 'specModel', label: '规格型号' },
    { component: 'Input', fieldName: 'brand', label: '品牌' },
    { component: 'Input', fieldName: 'baseUnit', label: '基本单位' },
    {
      component: 'Switch',
      fieldName: 'enableBatch',
      label: '启用批次',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'enableSn',
      label: '启用序列号',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'enableQuality',
      label: '启用质检',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'enableExpire',
      label: '启用保质期',
      defaultValue: false,
    },
    {
      component: 'InputNumber',
      fieldName: 'safeStock',
      label: '安全库存',
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      fieldName: 'minStock',
      label: '最小库存',
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      fieldName: 'maxStock',
      label: '最大库存',
      defaultValue: 0,
    },
    { component: 'Textarea', fieldName: 'remark', label: '备注' },
  ],
  handleSubmit: async (values) => {
    try {
      if (isEdit.value && editingId.value) {
        await updateMaterialApi(editingId.value, values);
        message.success('修改成功');
      } else {
        await createMaterialApi(values);
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
    content: `确定要删除物料 "${record.materialName}" 吗？`,
    onOk: async () => {
      await deleteMaterialApi(record.id);
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
        <a-button type="primary" @click="handleAdd">新增物料</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <a-button type="link" danger @click="handleDelete(row)">删除</a-button>
      </template>
    </Grid>
    <a-modal
      v-model:open="showModal"
      :title="isEdit ? '编辑物料' : '新增物料'"
      width="700px"
    >
      <Form />
    </a-modal>
  </Page>
</template>
