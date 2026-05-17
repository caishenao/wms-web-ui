import { requestClient } from '#/api/request';

export interface StockTransaction {
  id: number;
  transactionNo: string;
  changeType: string;
  sourceType: string;
  sourceNo: string;
  materialName: string;
  qtyBefore: number;
  qtyChange: number;
  qtyAfter: number;
  createTime: string;
}

export async function getStockTransactionListApi(params: Record<string, any>) {
  return requestClient.get('/stock/transaction/page', { params });
}
