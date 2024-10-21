'use client';

import { DatasetAPI } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';

export default function DatasetPage() {
  const { data: datasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => DatasetAPI.list()
  });

  return (
    <div>
      {datasets?.map((dataset) => (
        <div key={dataset.name}>
          <h2>{dataset.name}</h2>
          <p>{dataset.description}</p>
        </div>
      ))}
    </div>
  );
}
