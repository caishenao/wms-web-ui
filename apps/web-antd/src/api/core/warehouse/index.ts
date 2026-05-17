import { requestClient } from '#/api/request';

export interface Warehouse {
  id: number;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: string;
  manager: string;
  contactPhone: string;
  address: string;
  status: string;
  remark: string;
}

export async function getWarehouseListApi(params: Record<string, any>) {
  return requestClient.get('/warehouse/page', { params });
}

export async function createWarehouseApi(data: Record<string, any>) {
  return requestClient.post('/warehouse', data);
}

export async function updateWarehouseApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/warehouse/${id}`, data);
}

export async function deleteWarehouseApi(id: number) {
  return requestClient.delete(`/warehouse/${id}`);
}
