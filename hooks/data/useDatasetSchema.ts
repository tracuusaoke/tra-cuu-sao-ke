import { DatasetAPI } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';

export const useDatasetSchema = (dataset: string) => {
  return useQuery({
    queryKey: [`/datasets/${dataset}/schema`],
    queryFn: () => DatasetAPI.getSchema(dataset),
    initialData: []
  });
};
