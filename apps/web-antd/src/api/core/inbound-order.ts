import { requestClient } from '#/api/request';

export namespace InboundOrderApi {
  export interface InboundOrderDetail {
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

  export interface InboundOrder {
    id: number;
    orderNo: string;
    orderType: string;
    supplierId: number;
    supplierName: string;
    warehouseId: number;
    warehouseName: string;
    totalAmount: number;
    status: string;
    remark: string;
    creator: string;
    createTime: string;
    updateTime: string;
    details: InboundOrderDetail[];
  }

  export interface InboundOrderListParams {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    orderType?: string;
    supplierId?: number;
    warehouseId?: number;
    status?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getInboundOrderListApi(params: InboundOrderApi.InboundOrderListParams) {
  return requestClient.get<InboundOrderApi.InboundOrder[]>('/wms/inbound-orders/list', { params });
}

export async function getInboundOrderByIdApi(id: number) {
  return requestClient.get<InboundOrderApi.InboundOrder>(`/wms/inbound-orders/${id}`);
}

export async function createInboundOrderApi(data: Partial<InboundOrderApi.InboundOrder>) {
  return requestClient.post('/wms/inbound-orders', data);
}

export async function updateInboundOrderApi(id: number, data: Partial<InboundOrderApi.InboundOrder>) {
  return requestClient.put(`/wms/inbound-orders/${id}`, data);
}

export async function deleteInboundOrderApi(id: number) {
  return requestClient.delete(`/wms/inbound-orders/${id}`);
}

export async function submitInboundOrderApi(id: number) {
  return requestClient.put(`/wms/inbound-orders/${id}/submit`);
}

export async function auditInboundOrderApi(id: number, data: { approved: boolean; remark?: string }) {
  return requestClient.put(`/wms/inbound-orders/${id}/audit`, data);
}

export async function receiveInboundOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/inbound-orders/${id}/receive`, data);
}

export async function putawayInboundOrderApi(id: number, data: any) {
  return requestClient.put(`/wms/inbound-orders/${id}/putaway`, data);
}

export async function cancelInboundOrderApi(id: number) {
  return requestClient.put(`/wms/inbound-orders/${id}/cancel`);
}
