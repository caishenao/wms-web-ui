import { requestClient } from '#/api/request';

export namespace InventoryCheckApi {
  export interface InventoryCheck {
    id: number;
    orderNo: string;
    warehouseId: number;
    warehouseName: string;
    checkType: string;
    status: string;
    remark: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  export interface InventoryCheckListParams {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    warehouseId?: number;
    checkType?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getInventoryCheckListApi(params: InventoryCheckApi.InventoryCheckListParams) {
  return requestClient.get<InventoryCheckApi.InventoryCheck[]>('/wms/inventory-checks/list', { params });
}

export async function getInventoryCheckByIdApi(id: number) {
  return requestClient.get<InventoryCheckApi.InventoryCheck>(`/wms/inventory-checks/${id}`);
}

export async function createInventoryCheckApi(data: Partial<InventoryCheckApi.InventoryCheck>) {
  return requestClient.post('/wms/inventory-checks', data);
}

export async function startInventoryCheckApi(id: number) {
  return requestClient.put(`/wms/inventory-checks/${id}/start`);
}

export async function submitInventoryCheckApi(id: number) {
  return requestClient.put(`/wms/inventory-checks/${id}/submit`);
}

export async function auditInventoryCheckApi(id: number, data: { approved: boolean; remark?: string }) {
  return requestClient.put(`/wms/inventory-checks/${id}/audit`, data);
}

export async function cancelInventoryCheckApi(id: number) {
  return requestClient.put(`/wms/inventory-checks/${id}/cancel`);
}
