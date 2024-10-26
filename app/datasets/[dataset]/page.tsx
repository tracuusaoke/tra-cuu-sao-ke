'use client';

import { useParams } from 'next/navigation';

export default function DatasetPage() {
  const { dataset } = useParams<{ dataset: string }>();
  return <div>{dataset}</div>;
}
