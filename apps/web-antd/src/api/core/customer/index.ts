import { requestClient } from '#/api/request';

export interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  status: string;
  remark: string;
}

export async function getCustomerListApi(params: Record<string, any>) {
  return requestClient.get('/customer/page', { params });
}

export async function createCustomerApi(data: Record<string, any>) {
  return requestClient.post('/customer', data);
}

export async function updateCustomerApi(id: number, data: Record<string, any>) {
  return requestClient.put(`/customer/${id}`, data);
}

export async function deleteCustomerApi(id: number) {
  return requestClient.delete(`/customer/${id}`);
}
