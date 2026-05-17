import { requestClient } from '#/api/request';

export interface OutboundOrder {
  id: number;
  orderNo: string;
  outboundType: string;
  warehouseId: number;
  orderStatus: string;
  customerId: number | null;
  remark: string;
  createTime: string;
}

export async function getOutboundOrderListApi(params: Record<string, any>) {
  return requestClient.get('/outbound/order/page', { params });
}

export async function createOutboundOrderApi(data: Record<string, any>) {
  return requestClient.post('/outbound/order', data);
}

export async function updateOutboundOrderApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/outbound/order/${id}`, data);
}

export async function deleteOutboundOrderApi(id: number) {
  return requestClient.delete(`/outbound/order/${id}`);
}

export async function submitOutboundOrderApi(id: number) {
  return requestClient.post(`/outbound/order/${id}/submit`);
}

export async function auditOutboundOrderApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/outbound/order/${id}/audit`, data);
}

export async function allocateOutboundOrderApi(id: number) {
  return requestClient.post(`/outbound/order/${id}/allocate`);
}

export async function shipOutboundOrderApi(id: number) {
  return requestClient.post(`/outbound/order/${id}/ship`);
}
