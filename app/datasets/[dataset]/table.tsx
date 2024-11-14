import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDatasetSchema } from '@/hooks/data/useDatasetSchema';
import { useExtractDocuments } from '@/hooks/data/useExtractDocuments';
import type { FieldSchema } from '@/lib/api/dataset';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { ExportData } from './export';
import { DatasetFilter } from './filter';
import { DatasetSort } from './sort';

export function DatasetTable() {
  const { dataset } = useParams<{ dataset: string }>();
  const { data: fieldSchema } = useDatasetSchema(dataset);
  const fieldSchemaMap: Record<string, FieldSchema> = useMemo(() => {
    const map: Record<string, FieldSchema> = {};
    for (const field of fieldSchema ?? []) {
      map[field.name] = field;
    }
    return map;
  }, [fieldSchema]);

  const { data: records, isFetched } = useExtractDocuments(dataset);

  return (
    <div className='p-4'>
      <div className='flex justify-between mb-3'>
        <div className='flex gap-2'>
          <DatasetFilter />
          <DatasetSort />
        </div>
        <ExportData />
      </div>

      {records.length === 0 && isFetched && (
        <div className='text-muted-foreground text-center w-full'>Không có dữ liệu</div>
      )}

      {records.length > 0 && (
        <Table className='hidden md:table'>
          <TableHeader>
            <TableRow>
              {fieldSchema.map((schema) => (
                <TableHead key={schema.name}>{schema.displayName}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                {fieldSchema.map((schema) => {
                  const value = record[schema.name];
                  let valueStr: string | number;
                  if (typeof value === 'number') valueStr = value.toString();
                  else if (typeof value === 'string') {
                    valueStr = value;
                    if (schema.type === 'date') {
                      valueStr = new Date(value).toLocaleString();
                    }
                  } else {
                    valueStr = JSON.stringify(value);
                  }
                  return <TableCell key={schema.name}>{valueStr}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className='grid gap-3 md:hidden'>
        {records?.map((record) => (
          <div className='p-3 border rounded-md shadow-sm' key={record._id}>
            {Object.entries(record).map(([fieldName, value]) => {
              let valueStr: string | number;
              if (typeof value === 'number') valueStr = value.toString();
              else if (typeof value === 'string') {
                valueStr = value;
                if (fieldSchemaMap[fieldName]?.type === 'date') {
                  valueStr = new Date(value).toLocaleString();
                }
              } else {
                valueStr = JSON.stringify(value);
              }
              if (fieldName === '_id') return null;

              return (
                <div key={fieldName} className='flex justify-between gap-2'>
                  <div className='font-medium'>{fieldSchemaMap[fieldName]?.displayName ?? fieldName}:</div>
                  <div className='flex-1 text-end'>{valueStr}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
