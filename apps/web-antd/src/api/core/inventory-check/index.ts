import { requestClient } from '#/api/request';

export interface InventoryCheck {
  id: number;
  checkNo: string;
  warehouseId: number;
  checkType: string;
  orderStatus: string;
  remark: string;
  createTime: string;
}

export async function getInventoryCheckListApi(params: Record<string, any>) {
  return requestClient.get('/inventory/check/page', { params });
}

export async function createInventoryCheckApi(data: Record<string, any>) {
  return requestClient.post('/inventory/check', data);
}

export async function updateInventoryCheckApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/inventory/check/${id}`, data);
}

export async function deleteInventoryCheckApi(id: number) {
  return requestClient.delete(`/inventory/check/${id}`);
}

export async function submitInventoryCheckApi(id: number) {
  return requestClient.post(`/inventory/check/${id}/submit`);
}

export async function auditInventoryCheckApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/inventory/check/${id}/audit`, data);
}
