import { requestClient } from '#/api/request';

export interface TransferOrder {
  id: number;
  orderNo: string;
  fromWarehouseId: number;
  toWarehouseId: number;
  orderStatus: string;
  remark: string;
  createTime: string;
}

export async function getTransferOrderListApi(params: Record<string, any>) {
  return requestClient.get('/transfer/order/page', { params });
}

export async function createTransferOrderApi(data: Record<string, any>) {
  return requestClient.post('/transfer/order', data);
}

export async function updateTransferOrderApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/transfer/order/${id}`, data);
}

export async function deleteTransferOrderApi(id: number) {
  return requestClient.delete(`/transfer/order/${id}`);
}

export async function submitTransferOrderApi(id: number) {
  return requestClient.post(`/transfer/order/${id}/submit`);
}

export async function auditTransferOrderApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/transfer/order/${id}/audit`, data);
}
