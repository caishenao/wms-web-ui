import { requestClient } from '#/api/request';

export namespace TransferOrderApi {
  export interface TransferOrder {
    id: number;
    orderNo: string;
    sourceWarehouseId: number;
    sourceWarehouseName: string;
    targetWarehouseId: number;
    targetWarehouseName: string;
    status: string;
    remark: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  export interface TransferOrderListParams {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    sourceWarehouseId?: number;
    targetWarehouseId?: number;
    status?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getTransferOrderListApi(params: TransferOrderApi.TransferOrderListParams) {
  return requestClient.get<TransferOrderApi.TransferOrder[]>('/wms/transfer-orders/list', { params });
}

export async function getTransferOrderByIdApi(id: number) {
  return requestClient.get<TransferOrderApi.TransferOrder>(`/wms/transfer-orders/${id}`);
}

export async function createTransferOrderApi(data: Partial<TransferOrderApi.TransferOrder>) {
  return requestClient.post('/wms/transfer-orders', data);
}

export async function submitTransferOrderApi(id: number) {
  return requestClient.put(`/wms/transfer-orders/${id}/submit`);
}

export async function auditTransferOrderApi(id: number, data: { approved: boolean; remark?: string }) {
  return requestClient.put(`/wms/transfer-orders/${id}/audit`, data);
}

export async function outTransferOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/transfer-orders/${id}/out`, data);
}

export async function inTransferOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/transfer-orders/${id}/in`, data);
}

export async function cancelTransferOrderApi(id: number) {
  return requestClient.put(`/wms/transfer-orders/${id}/cancel`);
}
