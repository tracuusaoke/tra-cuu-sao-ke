import { DatasetAPI } from '@/lib/api/dataset';
import { useFilterStore } from '@/states/filter';
import { useQuery } from '@tanstack/react-query';

export function useExtractDocuments(dataset: string) {
  const filter = useFilterStore((state) => state.filter);

  return useQuery({
    queryKey: [`/datasets/${dataset}/documents`],
    queryFn: () => DatasetAPI.getDocuments(dataset, filter),
    enabled: false
  });
}
