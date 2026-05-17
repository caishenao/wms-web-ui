import { requestClient } from '#/api/request';

export namespace WarehouseLocationApi {
  export interface WarehouseLocation {
    id: number;
    locationCode: string;
    locationName: string;
    warehouseId: number;
    warehouseName: string;
    areaId: number;
    areaName: string;
    locationType: string;
    aisle: string;
    shelf: string;
    layer: number;
    grid: string;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface WarehouseLocationListParams {
    page?: number;
    pageSize?: number;
    warehouseId?: number;
    areaId?: number;
    locationCode?: string;
    locationName?: string;
    status?: string;
  }
}

export async function getWarehouseLocationListApi(params: WarehouseLocationApi.WarehouseLocationListParams) {
  return requestClient.get<WarehouseLocationApi.WarehouseLocation[]>('/wms/warehouse-locations/list', { params });
}

export async function getAllWarehouseLocationApi(warehouseId?: number, areaId?: number) {
  return requestClient.get<WarehouseLocationApi.WarehouseLocation[]>('/wms/warehouse-locations/all', {
    params: { warehouseId, areaId },
  });
}

export async function getWarehouseLocationByIdApi(id: number) {
  return requestClient.get<WarehouseLocationApi.WarehouseLocation>(`/wms/warehouse-locations/${id}`);
}

export async function createWarehouseLocationApi(data: Partial<WarehouseLocationApi.WarehouseLocation>) {
  return requestClient.post('/wms/warehouse-locations', data);
}

export async function updateWarehouseLocationApi(id: number, data: Partial<WarehouseLocationApi.WarehouseLocation>) {
  return requestClient.put(`/wms/warehouse-locations/${id}`, data);
}

export async function deleteWarehouseLocationApi(id: number) {
  return requestClient.delete(`/wms/warehouse-locations/${id}`);
}
