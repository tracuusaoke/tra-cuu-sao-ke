import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/dateRangePicker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { CirclePlus, ListFilter, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { type ChangeEvent, type ReactNode, useCallback, useState } from 'react';
import type { DateRange } from 'react-day-picker';

type ConditionContainerProps = {
  children: ReactNode;
  index: number;
};

function ConditionContainer({ children, index }: ConditionContainerProps) {
  const removeFilter = useQueryOptionsState((state) => state.removeFilter);
  return (
    <div className='flex gap-2'>
      {children}
      <Button variant={'outline'} onClick={() => removeFilter(index)} className='p-2'>
        <Trash2 />
      </Button>
    </div>
  );
}

function FilterSelect({ index }: { index: number }) {
  const { dataset } = useParams<{ dataset: string }>();
  const { data: fieldSchemas } = useDatasetSchema(dataset);
  const { filters, updateFilter } = useQueryOptionsState();

  const handleSelectChange = useCallback(
    (value: string) => {
      const schema = fieldSchemas.find((field) => field.name === value);
      if (!schema) return;

      if (schema.type === 'keyword') {
        updateFilter(index, { field: value, exact: '' });
      } else if (schema.type === 'date') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        updateFilter(index, {
          field: value,
          range: {
            from: lastMonth,
            to: new Date()
          }
        });
      } else if (schema.type === 'text') {
        updateFilter(index, { field: value, match: '' });
      } else {
        updateFilter(index, { field: value, range: { min: 0, max: 0 } });
      }
    },
    [index, fieldSchemas, updateFilter]
  );

  return (
    <Select value={filters[index]?.field} onValueChange={handleSelectChange}>
      <SelectTrigger className='min-w-28 max-w-28'>
        <SelectValue placeholder='Chọn trường' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fieldSchemas.map((field) => {
            if (!field.filterable) return null;
            return (
              <SelectItem key={field.name} value={field.name}>
                {field.displayName}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function DynamicFilter() {
  const { dataset } = useParams<{ dataset: string }>();
  const { data: fieldSchemas } = useDatasetSchema(dataset);

  const { filters, setFilterDate, setFilterNumber, setFilterString, addFilter } = useQueryOptionsState();

  const handleStringInput = useCallback(
    (index: number) => {
      return (e: ChangeEvent<HTMLInputElement>) => {
        setFilterString(index, e.target.value);
      };
    },
    [setFilterString]
  );

  const handleNumberInput = useCallback(
    (index: number, type: 'min' | 'max') => {
      return (e: ChangeEvent<HTMLInputElement>) => {
        setFilterNumber(index, type, e.target.valueAsNumber);
      };
    },
    [setFilterNumber]
  );

  const handleDateRangeChange = useCallback(
    (index: number) => {
      return (range?: DateRange) => setFilterDate(index, range);
    },
    [setFilterDate]
  );

  const appendFilter = useCallback(() => {
    const firstSchema = fieldSchemas[0];
    if (!firstSchema) return;

    if (firstSchema.type === 'keyword') addFilter({ field: firstSchema.name, exact: '' });
    else if (firstSchema.type === 'date') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      addFilter({
        field: firstSchema.name,
        range: {
          from: lastMonth,
          to: new Date()
        }
      });
    } else if (firstSchema.type === 'text') addFilter({ field: firstSchema.name, match: '' });
    else
      addFilter({
        field: firstSchema.name,
        range: {
          min: 0,
          max: 0
        }
      });
  }, [fieldSchemas, addFilter]);

  return (
    <div className='flex flex-col gap-2 min-w-[300px]'>
      <p className='font-medium leading-none mt-1'>Bộ lọc dữ liệu</p>
      {filters.length === 0 && (
        <small className='text-xs text-muted-foreground'>Không có bộ lọc nào được áp dụng</small>
      )}
      {filters.map((filter, index) => {
        if ('match' in filter) {
          return (
            <ConditionContainer key={`${filter.field}-${index}`} index={index}>
              <FilterSelect index={index} />
              <Input value={filter.match} onChange={handleStringInput(index)} />
            </ConditionContainer>
          );
        }
        if ('range' in filter) {
          const range = filter.range;
          if ('from' in range) {
            return (
              <ConditionContainer key={`${filter.field}-${index}`} index={index}>
                <FilterSelect index={index} />
                <DateRangePicker
                  placeholder='Chọn ngày'
                  className='w-full'
                  date={range}
                  // @ts-ignore
                  onSelect={handleDateRangeChange(index)}
                />
              </ConditionContainer>
            );
          }

          return (
            <ConditionContainer key={`${filter.field}-${index}`} index={index}>
              <FilterSelect index={index} />
              <div className='flex gap-2'>
                <Input value={range.min} placeholder={'Từ'} onChange={handleNumberInput(index, 'min')} />
                <Input placeholder={'Đến'} value={range.max} onChange={handleNumberInput(index, 'max')} />
              </div>
            </ConditionContainer>
          );
        }
        if ('exact' in filter) {
          return (
            <ConditionContainer key={`${filter.field}-${index}`} index={index}>
              <FilterSelect index={index} />
              <Input value={filter.exact} onChange={handleStringInput(index)} />
            </ConditionContainer>
          );
        }
        return null;
      })}
      <Button variant={'outline'} size={'sm'} className='p-2 w-full' onClick={appendFilter}>
        <CirclePlus />
      </Button>
    </div>
  );
}

export function DatasetFilter() {
  const dataset = useParams<{ dataset: string }>().dataset;
  const filters = useQueryOptionsState((state) => state.filters);
  const { refetch: fetchDocuments } = useExtractDocuments(dataset);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu
      onOpenChange={(value) => {
        if (!value) fetchDocuments();
        setOpen(value);
      }}
      open={open}
    >
      <DropdownMenuTrigger asChild>
        <Button size={'sm'} variant={'outline'}>
          <span className='hidden sm:block'>Lọc</span> <ListFilter />{' '}
          {filters.length > 0 && (
            <Badge className='px-2 bg-slate-100 hover:bg-slate-100 text-primary border-secondary shadow-none'>
              {filters.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2' side='bottom'>
        <DynamicFilter />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
