import { requestClient } from '#/api/request';

export interface MaterialCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  categoryLevel: number;
  parentId: number | null;
  sortOrder: number;
  status: string;
  remark: string;
}

export async function getMaterialCategoryListApi(params: Record<string, any>) {
  return requestClient.get('/material/category/page', { params });
}

export async function createMaterialCategoryApi(data: Record<string, any>) {
  return requestClient.post('/material/category', data);
}

export async function updateMaterialCategoryApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/material/category/${id}`, data);
}

export async function deleteMaterialCategoryApi(id: number) {
  return requestClient.delete(`/material/category/${id}`);
}
