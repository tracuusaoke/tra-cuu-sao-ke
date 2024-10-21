import { z } from 'zod';

import type { DateValue, RangeValue } from '@nextui-org/react';
import type { KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from 'react';

export interface ColumnInterface {
  name: string;
  uid: string;
  sortable: boolean;
  minWidth?: number | `${number}` | `${number}%` | null;
  width?: number | `${number}` | `${number}%` | null;
  // align?: "start" | "center" | "end"; nextUITable
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export const transactionColumns: Array<ColumnInterface> = [
  { name: 'Page Id', uid: 'pageid', sortable: true, align: 'center' },
  {
    name: 'Date',
    uid: 'date',
    sortable: true,
    minWidth: 20,
    align: 'center'
  },
  { name: 'Time', uid: 'time', sortable: true, minWidth: 20, align: 'center' },
  {
    name: 'Transaction Details',
    uid: 'transactiondetails',
    sortable: true,
    align: 'center'
  },
  { name: 'Debit Amount', uid: 'debitamount', sortable: true, align: 'center' },
  {
    name: 'Credit Amount',
    uid: 'creditamount',
    sortable: true,
    align: 'center'
  },
  { name: 'Balance', uid: 'balance', sortable: true, align: 'center' },
  {
    name: 'Document Number',
    uid: 'documentnumber',
    sortable: true,
    align: 'center'
  },
  {
    name: 'Reference Number',
    uid: 'referencenumber',
    sortable: true,
    align: 'center'
  },
  {
    name: 'Offset Account',
    uid: 'offsetaccount',
    sortable: true,
    align: 'center'
  }
];

export const TransactionValidator = z.object({
  txsId: z.string(),
  pageid: z.string(),
  date: z.string(),
  time: z.string(),
  documentnumber: z.string(),
  referencenumber: z.string(),
  transactiondetails: z.string(),
  debitamount: z.string(),
  creditamount: z.string(),
  balance: z.string(),
  offsetaccount: z.string()
});

export type Transaction = z.infer<typeof TransactionValidator>;

export const sampleTransactions: Array<Transaction> = Array.from({
  length: 10
}).map((_, i) => ({
  txsId: i.toString(),
  pageid: '1',
  date: '2021-09-01',
  time: '12:00:00',
  documentnumber: '1',
  referencenumber: '1',
  transactiondetails: '1',
  debitamount: '1',
  creditamount: '1',
  balance: '1',
  offsetaccount: '1'
}));

export interface TransactionQuery {
  keyword?: string;
  dateRangeFilter?: RangeValue<DateValue>;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
// Event bubbling can be problematic in real-world applications, so the default for React Spectrum components
// is not to propagate. This can be overridden by calling continuePropagation() on the event.
export type BaseEvent<T extends SyntheticEvent> = T & {
  /**
   * Use continuePropagation.
   * @deprecated */
  stopPropagation(): void;
  continuePropagation(): void;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type KeyboardEvent = BaseEvent<ReactKeyboardEvent<any>>;
