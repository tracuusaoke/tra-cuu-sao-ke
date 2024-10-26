'use client';

import { DateRangePicker } from '@/components/ui/dateRangePicker';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DatasetAPI, type DatasetSchema } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

// keyword -> Text input
// text -> Text input
// long | double -> Range input
// date -> Date range input

export default function DatasetPage() {
  const { dataset } = useParams<{ dataset: string }>();

  const { data: schema } = useQuery({
    queryKey: ['schema', dataset],
    queryFn: () => DatasetAPI.getSchema(dataset)
  });

  const inputDefs = useMemo(() => Object.entries(schema || {}), [schema]);

  return (
    <div>
      {inputDefs.map(([inputName, inputSchema]) => {
        if (inputSchema.type === 'keyword' || inputSchema.type === 'text') {
          return <Input key={inputName} placeholder={inputName} type='text' />;
        }
        if (inputSchema.type === 'long' || inputSchema.type === 'double') {
          return <Slider key={inputName} />;
        }
        if (inputSchema.type === 'date') {
          return <DateRangePicker key={inputName} />;
        }
        return null;
      })}
    </div>
  );
}
