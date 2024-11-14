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
    <div className='p-4 flex flex-col'>
      {datasets?.map((dataset) => (
        <Link key={dataset.name} href={`/datasets/${dataset.name}`}>
          <div className='px-4 py-2 rounded-md border shadow-sm'>
            <p className='font-medium text-primary'>{dataset.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
