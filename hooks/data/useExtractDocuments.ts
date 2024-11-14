import { DatasetAPI } from '@/lib/api/dataset';
import { useQueryOptionsState } from '@/states/filter';
import { useQuery } from '@tanstack/react-query';

export function useExtractDocuments(dataset: string) {
  const { filters, pagination, sorts } = useQueryOptionsState();

  return useQuery({
    queryKey: [`/datasets/${dataset}/documents`],
    queryFn: () =>
      DatasetAPI.getDocuments(dataset, {
        filters,
        pagination,
        sorts
      }),
    initialData: []
  });
}
