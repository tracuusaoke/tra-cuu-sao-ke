import type { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type NumberRange = { min: number; max: number };
export type DatasetFilter = Record<string, NumberRange | DateRange | string | boolean>;
export type DatasetSort = {
  field: string;
  order: 'asc' | 'desc';
};
export type DatasetPagination = {
  limit: number;
  offset: number;
};
export type DatasetQueryOptions = {
  filter?: DatasetFilter;
  sort?: DatasetSort[];
  pagination?: DatasetPagination;
};

type QueryOptionState = {
  filter: DatasetFilter;
  sort: DatasetSort[];
  pagination: DatasetPagination;
  setFilterString(fieldName: string, value: string): void;
  setFilterNumber(fieldName: string, type: 'min' | 'max', value: number): void;
  setFilterDate(fieldName: string, range?: DateRange): void;
  setPagination(pagination: DatasetPagination): void;
};

export const useQueryOptionsState = create<QueryOptionState>((set) => ({
  filter: {},
  sort: [],
  pagination: {
    limit: 100,
    offset: 0
  },
  setPagination(pagination) {
    set({ pagination });
  },
  setFilterDate(fieldName, range) {
    if (range)
      set((state) => ({
        filter: {
          ...state.filter,
          [fieldName]: range
        }
      }));
  },
  setFilterString(fieldName, value) {
    set((state) => ({ filter: { ...state.filter, [fieldName]: value } }));
  },
  setFilterNumber(fieldName, type, value) {
    set((state) => {
      const rangeFilter = (state.filter[fieldName] as NumberRange) ?? {};
      const parseValue = Number.isNaN(value) ? undefined : value;
      return {
        filter: {
          ...state.filter,
          [fieldName]: {
            ...rangeFilter,
            [type]: parseValue
          }
        }
      };
    });
  }
}));
