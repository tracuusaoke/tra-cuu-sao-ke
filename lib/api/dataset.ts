import { api } from './http';

export type Dataset = {
  name: string;
  description: string;
};
export type FieldSchema = {
  type: 'keyword' | 'text' | 'long' | 'double' | 'date';
  name: string;
  displayName: string;
  description?: string;
  order: number;
  filterable: boolean;
  sortable: boolean;
};

async function list(): Promise<Dataset[]> {
  const resp = await api.get<string[]>('/api/datasets');
  return resp.data.map((name) => ({ name, description: '' }));
}

async function getSchema(dataset: string): Promise<FieldSchema[]> {
  const resp = await api.get(`/api/datasets/${dataset}/schema`);
  return resp.data;
}

type Document = {
  _id: string;
  [key: string]: unknown;
};

async function getDocuments<T = Document>(dataset: string, options: unknown): Promise<T[]> {
  const resp = await api.post(`/api/datasets/${dataset}/documents`, options);
  return resp.data;
}

export const DatasetAPI = {
  list,
  getSchema,
  getDocuments
};
