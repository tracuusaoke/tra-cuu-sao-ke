import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQueryOptionsState } from '@/states/filter';
import { ArrowDownUp } from 'lucide-react';

export function DatasetSort() {
  const sorts = useQueryOptionsState((state) => state.sorts);
  return (
    <DropdownMenu>
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
        <div className='flex gap-2'>Hello cc</div>u
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
