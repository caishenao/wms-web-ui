import { requestClient } from '#/api/request';

export namespace WarehouseAreaApi {
  export interface WarehouseArea {
    id: number;
    areaCode: string;
    areaName: string;
    warehouseId: number;
    warehouseName: string;
    areaType: string;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface WarehouseAreaListParams {
    page?: number;
    pageSize?: number;
    warehouseId?: number;
    areaCode?: string;
    areaName?: string;
    status?: string;
  }
}

export async function getWarehouseAreaListApi(params: WarehouseAreaApi.WarehouseAreaListParams) {
  return requestClient.get<WarehouseAreaApi.WarehouseArea[]>('/wms/warehouse-areas/list', { params });
}

export async function getAllWarehouseAreaApi(warehouseId?: number) {
  return requestClient.get<WarehouseAreaApi.WarehouseArea[]>('/wms/warehouse-areas/all', {
    params: warehouseId ? { warehouseId } : undefined,
  });
}

export async function getWarehouseAreaByIdApi(id: number) {
  return requestClient.get<WarehouseAreaApi.WarehouseArea>(`/wms/warehouse-areas/${id}`);
}

export async function createWarehouseAreaApi(data: Partial<WarehouseAreaApi.WarehouseArea>) {
  return requestClient.post('/wms/warehouse-areas', data);
}

export async function updateWarehouseAreaApi(id: number, data: Partial<WarehouseAreaApi.WarehouseArea>) {
  return requestClient.put(`/wms/warehouse-areas/${id}`, data);
}

export async function deleteWarehouseAreaApi(id: number) {
  return requestClient.delete(`/wms/warehouse-areas/${id}`);
}
