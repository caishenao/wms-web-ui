import { requestClient } from '#/api/request';

export interface Stock {
  id: number;
  warehouseName: string;
  locationCode: string;
  materialCode: string;
  materialName: string;
  batchNo: string;
  snCode: string;
  qty: number;
  lockedQty: number;
  frozenQty: number;
  availableQty: number;
}

export async function getStockListApi(params: Record<string, any>) {
  return requestClient.get('/stock/page', { params });
}

export async function freezeStockApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/stock/${id}/freeze`, data);
}

export async function unfreezeStockApi(id: number, data: Record<string, any>) {
  return requestClient.post(`/stock/${id}/unfreeze`, data);
}
