import { requestClient } from '#/api/request';

export interface MaterialCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  parentId: number;
  categoryLevel: number;
  sortOrder: number;
  status: string;
  remark: string;
}

export async function getMaterialCategoryListApi(params: any) {
  return requestClient.get('/wms/material-categories/list', { params });
}

export async function getMaterialCategoryTreeApi() {
  return requestClient.get('/wms/material-categories/tree');
}

export async function getMaterialCategoryByIdApi(id: number) {
  return requestClient.get(`/wms/material-categories/${id}`);
}

export async function createMaterialCategoryApi(data: any) {
  return requestClient.post('/wms/material-categories', data);
}

export async function updateMaterialCategoryApi(id: number, data: any) {
  return requestClient.put(`/wms/material-categories/${id}`, data);
}

export async function deleteMaterialCategoryApi(id: number) {
  return requestClient.delete(`/wms/material-categories/${id}`);
}

export async function updateMaterialCategoryStatusApi(id: number, status: string) {
  return requestClient.put(`/wms/material-categories/${id}/status`, { status });
}
