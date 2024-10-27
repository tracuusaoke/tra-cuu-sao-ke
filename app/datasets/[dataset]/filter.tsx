import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/dateRangePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatasetAPI } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function DatasetFilter() {
  const { dataset } = useParams<{ dataset: string }>();

  const { data: fieldSchemas } = useQuery({
    queryKey: [`/datasets/${dataset}/schema`],
    queryFn: () => DatasetAPI.getSchema(dataset)
  });

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 p-4'>
        {fieldSchemas?.map((field) => {
          if (field.type === 'keyword' || field.type === 'text') {
            return (
              <div key={field.name} className='flex-1'>
                <Label htmlFor={field.name} className='mb-2'>
                  {field.displayName}
                </Label>
                <Input placeholder={field.description} type='text' id={field.name} />
              </div>
            );
          }
          if (field.type === 'long' || field.type === 'double') {
            return (
              <div className='flex gap-2' key={field.name}>
                <div className='flex-1'>
                  <Label htmlFor={`${field.name}-min`}>{field.displayName} tối thiểu</Label>
                  <Input type='number' id={field.name} placeholder={field.description} />
                </div>
                <div className='flex-1'>
                  <Label htmlFor={`${field.name}-max`}>{field.displayName} tối đa</Label>
                  <Input type='number' id={field.name} placeholder={field.description} />
                </div>
              </div>
            );
          }
          if (field.type === 'date') {
            return (
              <div key={field.name} className='flex-1'>
                <Label htmlFor={field.name}>{field.displayName}</Label>
                <DateRangePicker id={field.name} placeholder={field.description} />
              </div>
            );
          }
          return null;
        })}
        <div className='flex mt-2'>
          <Button className='flex-1'>Lọc</Button>
        </div>
      </CardContent>
    </Card>
  );
}
