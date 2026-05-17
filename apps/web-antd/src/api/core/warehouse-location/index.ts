import { requestClient } from '#/api/request';

export interface WarehouseLocation {
  id: number;
  locationCode: string;
  locationName: string;
  warehouseId: number;
  areaId: number;
  locationType: string;
  status: string;
  remark: string;
}

export async function getWarehouseLocationListApi(params: Record<string, any>) {
  return requestClient.get('/warehouse/location/page', { params });
}

export async function createWarehouseLocationApi(data: Record<string, any>) {
  return requestClient.post('/warehouse/location', data);
}

export async function updateWarehouseLocationApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/warehouse/location/${id}`, data);
}

export async function deleteWarehouseLocationApi(id: number) {
  return requestClient.delete(`/warehouse/location/${id}`);
}
