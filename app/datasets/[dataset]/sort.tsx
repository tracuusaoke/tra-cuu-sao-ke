import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useDatasetSchema } from '@/hooks/data/useDatasetSchema';
import { useExtractDocuments } from '@/hooks/data/useExtractDocuments';
import { useQueryOptionsState } from '@/states/filter';
import { ArrowDownUp, CirclePlus, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type Order = 'asc' | 'desc';
const sortOrder: Record<Order, string> = {
  asc: 'Tăng dần',
  desc: 'Giảm dần'
};

function SortSelect({ index }: { index: number }) {
  const { dataset } = useParams<{ dataset: string }>();
  const { sorts, updateSort, removeSort } = useQueryOptionsState();
  const { data: fieldSchemas } = useDatasetSchema(dataset);
  const sortableFieldSchemas = useMemo(
    () => fieldSchemas.filter((schema) => schema.sortable),
    [fieldSchemas]
  );

  const fieldSchema = useMemo(() => {
    return sortableFieldSchemas.find((schema) => schema.name === sorts[index]?.field);
  }, [sortableFieldSchemas, sorts, index]);

  const availableSorts = useMemo(() => {
    return sortableFieldSchemas.filter((schema) => {
      return !sorts.some((sort) => sort.field === schema.name);
    });
  }, [sorts, sortableFieldSchemas]);

  const handleSelectChange = useCallback(
    (value: string) => {
      updateSort(index, {
        field: value,
        order: 'asc'
      });
    },
    [updateSort, index]
  );

  const handleOrderChange = useCallback(
    (value: Order) => {
      updateSort(index, {
        field: sorts[index]?.field ?? '',
        order: value
      });
    },
    [updateSort, index, sorts]
  );

  return (
    <div className='flex justify-between w-full gap-2'>
      <Select value={sorts[index]?.field} onValueChange={handleSelectChange}>
        <SelectTrigger className='min-w-28 max-w-28'>
          <SelectValue placeholder='Chọn trường' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={fieldSchema?.name ?? ''}>{fieldSchema?.displayName}</SelectItem>
            {availableSorts.map((schema) => (
              <SelectItem key={schema.name} value={schema.name}>
                {schema.displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={sorts[index]?.order} onValueChange={(value: Order) => handleOrderChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder='Chọn trường' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='asc'>{sortOrder.asc}</SelectItem>
            <SelectItem value='desc'>{sortOrder.desc}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant={'outline'} onClick={() => removeSort(index)} className='p-2'>
        <Trash2 />
      </Button>
    </div>
  );
}

function DynamicSort() {
  const { dataset } = useParams<{ dataset: string }>();
  const { sorts, addSort } = useQueryOptionsState();
  const { data: fieldSchemas } = useDatasetSchema(dataset);

  const sortableFieldSchemas = useMemo(
    () => fieldSchemas.filter((schema) => schema.sortable),
    [fieldSchemas]
  );

  const availableSorts = useMemo(() => {
    return sortableFieldSchemas.filter((schema) => {
      return !sorts.some((sort) => sort.field === schema.name);
    });
  }, [sorts, sortableFieldSchemas]);

  const addSortOption = useCallback(() => {
    const newOption = availableSorts[0];
    if (!newOption) return;
    addSort({
      field: newOption.name,
      order: 'asc'
    });
  }, [availableSorts, addSort]);

  return (
    <div className='flex flex-col gap-2 min-w-[300px]'>
      <p className='font-medium leading-none mt-1'>Sắp xếp</p>
      {sorts.length === 0 && (
        <small className='text-xs text-muted-foreground'>Không có bộ sắp xếp nào được áp dụng</small>
      )}
      {sorts.map((sort, index) => {
        return <SortSelect key={sort.field} index={index} />;
      })}
      <Button
        variant={'outline'}
        size={'sm'}
        className='p-2 w-full'
        disabled={availableSorts.length === 0}
        onClick={addSortOption}
      >
        <CirclePlus />
      </Button>
    </div>
  );
}

export function DatasetSort() {
  const sorts = useQueryOptionsState((state) => state.sorts);
  const [open, setOpen] = useState(false);
  const { dataset } = useParams<{ dataset: string }>();
  const { refetch: fetchDocuments } = useExtractDocuments(dataset);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(value) => {
        if (!value) fetchDocuments();
        setOpen(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button size={'sm'} variant={'outline'}>
          <span className='hidden sm:block'>Sắp xếp</span> <ArrowDownUp />{' '}
          {sorts.length > 0 && (
            <Badge className='px-2 bg-slate-100 hover:bg-slate-100 text-primary border-secondary shadow-none'>
              {sorts.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full p-2'>
        <DynamicSort />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
