import { requestClient } from '#/api/request';

export namespace StockApi {
  export interface Stock {
    id: number;
    materialId: number;
    materialCode: string;
    materialName: string;
    spec: string;
    unitId: number;
    unitName: string;
    warehouseId: number;
    warehouseName: string;
    areaId: number;
    areaName: string;
    locationId: number;
    locationCode: string;
    quantity: number;
    frozenQuantity: number;
    availableQuantity: number;
    batchNo: string;
    productionDate: string;
    expiryDate: string;
    updateTime: string;
  }

  export interface StockListParams {
    page?: number;
    pageSize?: number;
    materialId?: number;
    materialCode?: string;
    warehouseId?: number;
    areaId?: number;
    locationId?: number;
    batchNo?: string;
  }

  export interface StockSummary {
    materialId: number;
    materialCode: string;
    materialName: string;
    totalQuantity: number;
    frozenQuantity: number;
    availableQuantity: number;
  }
}

export async function getStockListApi(params: StockApi.StockListParams) {
  return requestClient.get<StockApi.Stock[]>('/wms/stocks/list', { params });
}

export async function getStockSummaryApi(params: any) {
  return requestClient.get<StockApi.StockSummary[]>('/wms/stocks/summary', { params });
}

export async function freezeStockApi(data: {
  stockId: number;
  quantity: number;
  remark?: string;
}) {
  return requestClient.put('/wms/stocks/freeze', data);
}

export async function unfreezeStockApi(data: {
  stockId: number;
  quantity: number;
  remark?: string;
}) {
  return requestClient.put('/wms/stocks/unfreeze', data);
}
