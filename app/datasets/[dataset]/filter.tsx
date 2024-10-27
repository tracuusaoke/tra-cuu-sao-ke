import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/dateRangePicker';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DatasetAPI } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export function DatasetFilter() {
  const { dataset } = useParams<{ dataset: string }>();

  const { data: schema } = useQuery({
    queryKey: ['schema', dataset],
    queryFn: () => DatasetAPI.getSchema(dataset)
  });

  const inputDefs = useMemo(() => Object.entries(schema || {}), [schema]);

  return (
    <Card>
      <CardContent className='flex flex-wrap gap-2 p-4'>
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
      </CardContent>
    </Card>
  );
}
