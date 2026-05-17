import { requestClient } from '#/api/request';

export namespace CustomerApi {
  export interface Customer {
    id: number;
    customerCode: string;
    customerName: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface CustomerListParams {
    page?: number;
    pageSize?: number;
    customerCode?: string;
    customerName?: string;
    status?: string;
  }
}

export async function getCustomerListApi(params: CustomerApi.CustomerListParams) {
  return requestClient.get<CustomerApi.Customer[]>('/wms/customers/list', { params });
}

export async function getCustomerByIdApi(id: number) {
  return requestClient.get<CustomerApi.Customer>(`/wms/customers/${id}`);
}

export async function createCustomerApi(data: Partial<CustomerApi.Customer>) {
  return requestClient.post('/wms/customers', data);
}

export async function updateCustomerApi(id: number, data: Partial<CustomerApi.Customer>) {
  return requestClient.put(`/wms/customers/${id}`, data);
}

export async function deleteCustomerApi(id: number) {
  return requestClient.delete(`/wms/customers/${id}`);
}
