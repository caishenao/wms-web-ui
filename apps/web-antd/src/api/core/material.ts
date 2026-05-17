import { requestClient } from '#/api/request';

export namespace MaterialApi {
  export interface Material {
    id: number;
    materialCode: string;
    materialName: string;
    categoryId: number;
    categoryName: string;
    spec: string;
    unitId: number;
    unitName: string;
    barcode: string;
    weight: number;
    volume: number;
    safetyStock: number;
    maxStock: number;
    minStock: number;
    status: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface MaterialListParams {
    page?: number;
    pageSize?: number;
    materialCode?: string;
    materialName?: string;
    categoryId?: number;
    status?: string;
  }
}

export async function getMaterialListApi(params: MaterialApi.MaterialListParams) {
  return requestClient.get<MaterialApi.Material[]>('/wms/materials/list', { params });
}

export async function getMaterialByIdApi(id: number) {
  return requestClient.get<MaterialApi.Material>(`/wms/materials/${id}`);
}

export async function createMaterialApi(data: Partial<MaterialApi.Material>) {
  return requestClient.post('/wms/materials', data);
}

export async function updateMaterialApi(id: number, data: Partial<MaterialApi.Material>) {
  return requestClient.put(`/wms/materials/${id}`, data);
}

export async function deleteMaterialApi(id: number) {
  return requestClient.delete(`/wms/materials/${id}`);
}

export async function updateMaterialStatusApi(id: number, status: string) {
  return requestClient.put(`/wms/materials/${id}/status`, { status });
}
