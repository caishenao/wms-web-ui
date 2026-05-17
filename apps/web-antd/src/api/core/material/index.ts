import { requestClient } from '#/api/request';

export interface Material {
  id: number;
  materialCode: string;
  materialName: string;
  categoryId: number;
  materialType: string;
  specModel: string;
  brand: string;
  baseUnit: string;
  status: string;
  enableBatch: boolean;
  enableSn: boolean;
  enableQuality: boolean;
  enableExpire: boolean;
  safeStock: number;
  minStock: number;
  maxStock: number;
  remark: string;
}

export async function getMaterialListApi(params: Record<string, any>) {
  return requestClient.get('/material/page', { params });
}

export async function createMaterialApi(data: Record<string, any>) {
  return requestClient.post('/material', data);
}

export async function updateMaterialApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/material/${id}`, data);
}

export async function deleteMaterialApi(id: number) {
  return requestClient.delete(`/material/${id}`);
}
