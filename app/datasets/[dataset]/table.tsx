import { Card, CardContent } from '@/components/ui/card';
import { useExtractDocuments } from '@/hooks/useExtractDocuments';
import { DatasetAPI, type FieldSchema } from '@/lib/api/dataset';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export function DatasetTable() {
  const { dataset } = useParams<{ dataset: string }>();

  const { data: fieldSchemas } = useQuery({
    queryKey: [`/datasets/${dataset}/schema`],
    queryFn: () => DatasetAPI.getSchema(dataset)
  });

  const { data: records, refetch: fetchDocuments } = useExtractDocuments(dataset);

  // Fetch documents on initial render
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const fieldSchemaMap = useMemo(() => {
    if (!fieldSchemas) return {};
    return fieldSchemas.reduce(
      (acc, field) => {
        acc[field.name] = field;
        return acc;
      },
      {} as Record<string, FieldSchema>
    );
  }, [fieldSchemas]);

  return (
    <div className='px-4 flex flex-col gap-4'>
      {records?.map((record) => (
        <Card key={record._id}>
          <CardContent className='pt-4 grid gap-2'>
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
                <div key={fieldName}>
                  <div className='font-semibold'>{fieldSchemaMap[fieldName]?.displayName ?? fieldName}</div>
                  <div>{valueStr}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
