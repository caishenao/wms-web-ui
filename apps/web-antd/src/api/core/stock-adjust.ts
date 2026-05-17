import { requestClient } from '#/api/request';

export namespace StockAdjustApi {
  export interface StockAdjustOrder {
    id: number;
    orderNo: string;
    adjustType: string;
    warehouseId: number;
    warehouseName: string;
    status: string;
    remark: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  export interface StockAdjustOrderListParams {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    adjustType?: string;
    warehouseId?: number;
    status?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getStockAdjustOrderListApi(params: StockAdjustApi.StockAdjustOrderListParams) {
  return requestClient.get<StockAdjustApi.StockAdjustOrder[]>('/wms/stock-adjust-orders/list', { params });
}

export async function getStockAdjustOrderByIdApi(id: number) {
  return requestClient.get<StockAdjustApi.StockAdjustOrder>(`/wms/stock-adjust-orders/${id}`);
}

export async function createStockAdjustOrderApi(data: Partial<StockAdjustApi.StockAdjustOrder>) {
  return requestClient.post('/wms/stock-adjust-orders', data);
}

export async function auditStockAdjustOrderApi(id: number, data: { approved: boolean; remark?: string }) {
  return requestClient.put(`/wms/stock-adjust-orders/${id}/audit`, data);
}
