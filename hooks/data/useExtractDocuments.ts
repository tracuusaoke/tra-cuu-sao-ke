import { DatasetAPI } from '@/lib/api/dataset';
import { useQueryOptionsState } from '@/states/filter';
import { useQuery } from '@tanstack/react-query';

export function useExtractDocuments(dataset: string) {
  const queryOptions = useQueryOptionsState();

  return useQuery({
    queryKey: [`/datasets/${dataset}/documents`],
    queryFn: () => {
      const filter: Record<string, unknown> = {};
      const filterEntries = Object.entries(queryOptions.filters);
      for (const [key, value] of filterEntries) {
        if (typeof value === 'object') {
          if ('from' in value) filter[key] = { min: value.from, max: value.to };
          else filter[key] = value;
        } else if (typeof value === 'string') {
          if (value.length === 0) continue;
          filter[key] = value;
        } else {
          filter[key] = value;
        }
      }
      const options = {
        filter: filter,
        sort: queryOptions.sorts,
        pagination: queryOptions.pagination
      };
      return DatasetAPI.getDocuments(dataset, options);
    },
    enabled: false
  });
}
