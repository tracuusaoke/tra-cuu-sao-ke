'use client';

import { DatasetAPI } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function DatasetPage() {
  const { data: datasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => DatasetAPI.list()
  });

  return (
    <div>
      {datasets?.map((dataset) => (
        <div key={dataset.name}>
          <Link href={`/datasets/${dataset.name}`}>{dataset.name}</Link>
        </div>
      ))}
    </div>
  );
}
