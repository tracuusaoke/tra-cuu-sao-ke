'use client';

import { DatasetFilter } from './filter';

// keyword -> Text input
// text -> Text input
// long | double -> Range input
// date -> Date range input

export default function DatasetPage() {
  return (
    <div>
      <DatasetFilter />
    </div>
  );
}
