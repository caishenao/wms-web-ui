import { requestClient } from '#/api/request';

export namespace WarehouseApi {
  export interface Warehouse {
    id: number;
    warehouseCode: string;
    warehouseName: string;
    warehouseType: string;
    address: string;
    contact: string;
    phone: string;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface WarehouseListParams {
    page?: number;
    pageSize?: number;
    warehouseCode?: string;
    warehouseName?: string;
    status?: string;
  }
}

export async function getWarehouseListApi(params: WarehouseApi.WarehouseListParams) {
  return requestClient.get<WarehouseApi.Warehouse[]>('/wms/warehouses/list', { params });
}

export async function getAllWarehouseApi() {
  return requestClient.get<WarehouseApi.Warehouse[]>('/wms/warehouses/all');
}

export async function getWarehouseByIdApi(id: number) {
  return requestClient.get<WarehouseApi.Warehouse>(`/wms/warehouses/${id}`);
}

export async function createWarehouseApi(data: Partial<WarehouseApi.Warehouse>) {
  return requestClient.post('/wms/warehouses', data);
}

export async function updateWarehouseApi(id: number, data: Partial<WarehouseApi.Warehouse>) {
  return requestClient.put(`/wms/warehouses/${id}`, data);
}

export async function deleteWarehouseApi(id: number) {
  return requestClient.delete(`/wms/warehouses/${id}`);
}
