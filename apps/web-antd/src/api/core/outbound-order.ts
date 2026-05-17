import { requestClient } from '#/api/request';

export namespace OutboundOrderApi {
  export interface OutboundOrderDetail {
    id: number;
    orderId: number;
    materialId: number;
    materialCode: string;
    materialName: string;
    spec: string;
    unitId: number;
    unitName: string;
    planQuantity: number;
    realQuantity: number;
    warehouseId: number;
    areaId: number;
    locationId: number;
    remark: string;
  }

  export interface OutboundOrder {
    id: number;
    orderNo: string;
    orderType: string;
    customerId: number;
    customerName: string;
    warehouseId: number;
    warehouseName: string;
    totalAmount: number;
    status: string;
    remark: string;
    creator: string;
    createTime: string;
    updateTime: string;
    details: OutboundOrderDetail[];
  }

  export interface OutboundOrderListParams {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    orderType?: string;
    customerId?: number;
    warehouseId?: number;
    status?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getOutboundOrderListApi(params: OutboundOrderApi.OutboundOrderListParams) {
  return requestClient.get<OutboundOrderApi.OutboundOrder[]>('/wms/outbound-orders/list', { params });
}

export async function getOutboundOrderByIdApi(id: number) {
  return requestClient.get<OutboundOrderApi.OutboundOrder>(`/wms/outbound-orders/${id}`);
}

export async function createOutboundOrderApi(data: Partial<OutboundOrderApi.OutboundOrder>) {
  return requestClient.post('/wms/outbound-orders', data);
}

export async function updateOutboundOrderApi(id: number, data: Partial<OutboundOrderApi.OutboundOrder>) {
  return requestClient.put(`/wms/outbound-orders/${id}`, data);
}

export async function deleteOutboundOrderApi(id: number) {
  return requestClient.delete(`/wms/outbound-orders/${id}`);
}

export async function submitOutboundOrderApi(id: number) {
  return requestClient.put(`/wms/outbound-orders/${id}/submit`);
}

export async function auditOutboundOrderApi(id: number, data: { approved: boolean; remark?: string }) {
  return requestClient.put(`/wms/outbound-orders/${id}/audit`, data);
}

export async function allocateOutboundOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/outbound-orders/${id}/allocate`, data);
}

export async function shipOutboundOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/outbound-orders/${id}/ship`, data);
}

export async function cancelOutboundOrderApi(id: number) {
  return requestClient.put(`/wms/outbound-orders/${id}/cancel`);
}
