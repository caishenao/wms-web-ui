import { requestClient } from '#/api/request';

export namespace StockTransactionApi {
  export interface StockTransaction {
    id: number;
    transactionNo: string;
    transactionType: string;
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
    beforeQuantity: number;
    afterQuantity: number;
    batchNo: string;
    orderNo: string;
    operator: string;
    remark: string;
    createTime: string;
  }

  export interface StockTransactionListParams {
    page?: number;
    pageSize?: number;
    transactionNo?: string;
    transactionType?: string;
    materialId?: number;
    materialCode?: string;
    warehouseId?: number;
    batchNo?: string;
    startTime?: string;
    endTime?: string;
  }
}

export async function getStockTransactionListApi(params: StockTransactionApi.StockTransactionListParams) {
  return requestClient.get<StockTransactionApi.StockTransaction[]>('/wms/stock-transactions/list', { params });
}

export async function getStockTransactionByIdApi(id: number) {
  return requestClient.get<StockTransactionApi.StockTransaction>(`/wms/stock-transactions/${id}`);
}
