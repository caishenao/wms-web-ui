import { requestClient } from '#/api/request';

export interface WarehouseArea {
  id: number;
  areaCode: string;
  areaName: string;
  warehouseId: number;
  areaType: string;
  status: string;
  remark: string;
}

export async function getWarehouseAreaListApi(params: Record<string, any>) {
  return requestClient.get('/warehouse/area/page', { params });
}

export async function createWarehouseAreaApi(data: Record<string, any>) {
  return requestClient.post('/warehouse/area', data);
}

export async function updateWarehouseAreaApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/warehouse/area/${id}`, data);
}

export async function deleteWarehouseAreaApi(id: number) {
  return requestClient.delete(`/warehouse/area/${id}`);
}
