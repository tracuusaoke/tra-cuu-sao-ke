import { api } from './http';

export type Dataset = {
  name: string;
  description: string;
};

export type DatasetFieldSchema = {
  type: string;
  format?: string;
};
export type DatasetSchema = Record<string, DatasetFieldSchema>;

async function list(): Promise<Dataset[]> {
  const resp = await api.get<string[]>('/api/datasets');
  return resp.data.map((name) => ({ name, description: '' }));
}

async function getSchema(dataset: string): Promise<DatasetSchema> {
  const resp = await api.get<DatasetSchema>(`/api/datasets/${dataset}/schema`);
  return resp.data;
}

async function getDocuments(dataset: string): Promise<unknown> {
  const resp = await api.get(`/api/datasets/${dataset}/documents`);
  return resp.data;
}

export const DatasetAPI = {
  list,
  getSchema,
  getDocuments
};
