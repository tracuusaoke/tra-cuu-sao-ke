import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/dateRangePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExtractDocuments } from '@/hooks/useExtractDocuments';
import { DatasetAPI } from '@/lib/api/dataset';
import { useQueryOptionsState } from '@/states/filter';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { type ChangeEvent, useCallback } from 'react';
import type { DateRange } from 'react-day-picker';

export function DatasetFilter() {
  const { dataset } = useParams<{ dataset: string }>();

  const { data: fieldSchemas } = useQuery({
    queryKey: [`/datasets/${dataset}/schema`],
    queryFn: () => DatasetAPI.getSchema(dataset)
  });

  const {
    filter,
    setFilterDate: setDate,
    setFilterNumber: setNumber,
    setFilterString: setString
  } = useQueryOptionsState();

  const { refetch: fetchDocuments } = useExtractDocuments(dataset);

  const handleStringInput = useCallback(
    (fieldName: string) => {
      return (e: ChangeEvent<HTMLInputElement>) => {
        setString(fieldName, e.target.value);
      };
    },
    [setString]
  );

  const handleNumberInput = useCallback(
    (fieldName: string, type: 'min' | 'max') => {
      return (e: ChangeEvent<HTMLInputElement>) => {
        setNumber(fieldName, type, e.target.valueAsNumber);
      };
    },
    [setNumber]
  );

  const handleDateRangeChange = useCallback(
    (fieldName: string) => {
      return (range?: DateRange) => setDate(fieldName, range);
    },
    [setDate]
  );

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 p-4'>
        {fieldSchemas?.map((field) => {
          if (!field.filterable) return null;
          if (field.type === 'keyword' || field.type === 'text') {
            return (
              <div key={field.name} className='flex-1'>
                <Label htmlFor={field.name} className='mb-2'>
                  {field.displayName}
                </Label>
                <Input
                  placeholder={field.description}
                  type='text'
                  id={field.name}
                  onChange={handleStringInput(field.name)}
                />
              </div>
            );
          }
          if (field.type === 'long' || field.type === 'double') {
            return (
              <div className='flex gap-2' key={field.name}>
                <div className='flex-1'>
                  <Label htmlFor={`${field.name}-min`}>{field.displayName} tối thiểu</Label>
                  <Input
                    type='number'
                    id={field.name}
                    placeholder={field.description}
                    onChange={handleNumberInput(field.name, 'min')}
                  />
                </div>
                <div className='flex-1'>
                  <Label htmlFor={`${field.name}-max`}>{field.displayName} tối đa</Label>
                  <Input
                    type='number'
                    id={field.name}
                    placeholder={field.description}
                    onChange={handleNumberInput(field.name, 'max')}
                  />
                </div>
              </div>
            );
          }
          if (field.type === 'date') {
            return (
              <div key={field.name} className='flex-1'>
                <Label htmlFor={field.name}>{field.displayName}</Label>
                <DateRangePicker
                  id={field.name}
                  placeholder={field.description ?? ''}
                  date={filter[field.name] as DateRange}
                  // @ts-ignore
                  onSelect={handleDateRangeChange(field.name)}
                />
              </div>
            );
          }
          return null;
        })}
        <div className='flex mt-2'>
          <Button
            className='flex-1'
            onClick={() => {
              fetchDocuments();
            }}
          >
            Lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
