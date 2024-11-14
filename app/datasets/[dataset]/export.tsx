import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ExportData() {
  return (
    <Button variant={'outline'} size={'sm'}>
      <Download />
      <span className='hidden sm:block'>CSV</span>
    </Button>
  );
}
