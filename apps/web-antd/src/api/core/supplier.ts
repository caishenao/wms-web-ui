import { requestClient } from '#/api/request';

export namespace SupplierApi {
  export interface Supplier {
    id: number;
    supplierCode: string;
    supplierName: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface SupplierListParams {
    page?: number;
    pageSize?: number;
    supplierCode?: string;
    supplierName?: string;
    status?: string;
  }
}

export async function getSupplierListApi(params: SupplierApi.SupplierListParams) {
  return requestClient.get<SupplierApi.Supplier[]>('/wms/suppliers/list', { params });
}

export async function getSupplierByIdApi(id: number) {
  return requestClient.get<SupplierApi.Supplier>(`/wms/suppliers/${id}`);
}

export async function createSupplierApi(data: Partial<SupplierApi.Supplier>) {
  return requestClient.post('/wms/suppliers', data);
}

export async function updateSupplierApi(id: number, data: Partial<SupplierApi.Supplier>) {
  return requestClient.put(`/wms/suppliers/${id}`, data);
}

export async function deleteSupplierApi(id: number) {
  return requestClient.delete(`/wms/suppliers/${id}`);
}
