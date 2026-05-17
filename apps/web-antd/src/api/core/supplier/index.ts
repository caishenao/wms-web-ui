import { requestClient } from '#/api/request';

export interface Supplier {
  id: number;
  supplierCode: string;
  supplierName: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  status: string;
  remark: string;
}

export async function getSupplierListApi(params: Record<string, any>) {
  return requestClient.get('/supplier/page', { params });
}

export async function createSupplierApi(data: Record<string, any>) {
  return requestClient.post('/supplier', data);
}

export async function updateSupplierApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/supplier/${id}`, data);
}

export async function deleteSupplierApi(id: number) {
  return requestClient.delete(`/supplier/${id}`);
}
