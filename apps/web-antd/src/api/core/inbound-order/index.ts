import { requestClient } from '#/api/request';

export interface InboundOrder {
  id: number;
  orderNo: string;
  inboundType: string;
  warehouseId: number;
  orderStatus: string;
  supplierId: number | null;
  remark: string;
  createTime: string;
}

export async function getInboundOrderListApi(params: Record<string, any>) {
  return requestClient.get('/inbound/order/page', { params });
}

export async function createInboundOrderApi(data: Record<string, any>) {
  return requestClient.post('/inbound/order', data);
}

export async function updateInboundOrderApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/inbound/order/${id}`, data);
}

export async function deleteInboundOrderApi(id: number) {
  return requestClient.delete(`/inbound/order/${id}`);
}

export async function submitInboundOrderApi(id: number) {
  return requestClient.post(`/inbound/order/${id}/submit`);
}

export async function auditInboundOrderApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/inbound/order/${id}/audit`, data);
}
