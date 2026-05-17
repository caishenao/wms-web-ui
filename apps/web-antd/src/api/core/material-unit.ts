import { requestClient } from '#/api/request';

export namespace MaterialUnitApi {
  export interface MaterialUnit {
    id: number;
    unitCode: string;
    unitName: string;
    baseUnit: boolean;
    conversionRate: number;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface MaterialUnitListParams {
    page?: number;
    pageSize?: number;
    unitCode?: string;
    unitName?: string;
    status?: string;
  }
}

export async function getMaterialUnitListApi(params: MaterialUnitApi.MaterialUnitListParams) {
  return requestClient.get<MaterialUnitApi.MaterialUnit[]>('/wms/material-units/list', { params });
}

export async function getAllMaterialUnitApi() {
  return requestClient.get<MaterialUnitApi.MaterialUnit[]>('/wms/material-units/all');
}

export async function getMaterialUnitByIdApi(id: number) {
  return requestClient.get<MaterialUnitApi.MaterialUnit>(`/wms/material-units/${id}`);
}

export async function createMaterialUnitApi(data: Partial<MaterialUnitApi.MaterialUnit>) {
  return requestClient.post('/wms/material-units', data);
}

export async function updateMaterialUnitApi(id: number, data: Partial<MaterialUnitApi.MaterialUnit>) {
  return requestClient.put(`/wms/material-units/${id}`, data);
}

export async function deleteMaterialUnitApi(id: number) {
  return requestClient.delete(`/wms/material-units/${id}`);
}
