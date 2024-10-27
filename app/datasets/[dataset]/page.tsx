'use client';

import { DatasetFilter } from './filter';
import { DatasetTable } from './table';

// keyword -> Text input
// text -> Text input
// long | double -> Range input
// date -> Date range input

export default function DatasetPage() {
  return (
    <div className='flex flex-col gap-4'>
      <DatasetFilter />
      <DatasetTable />
    </div>
  );
}
