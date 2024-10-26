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
      <ul className='menu menu-md bg-base-200 rounded-box w-56'>
        {datasets?.map((dataset) => (
          <li key={dataset.name}>
            <Link href={`/datasets/${dataset.name}`}>{dataset.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
