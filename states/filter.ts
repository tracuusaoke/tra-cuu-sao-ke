import type { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type NumberRange = { min: number; max: number };
type NumberFilter = { field: string; range: NumberRange };
type DateFilter = { field: string; range: DateRange };
type KeywordFilter = { field: string; exact: string };
type TextFilter = { field: string; match: string };

export type DatasetFilter = TextFilter | KeywordFilter | DateFilter | NumberFilter;
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
  filters: DatasetFilter[];
  sorts: DatasetSort[];
  pagination: DatasetPagination;

  // For sorting
  addSort(sort: DatasetSort): void;
  updateSort(index: number, sort: DatasetSort): void;
  removeSort(index: number): void;

  // For pagination
  setPagination(pagination: DatasetPagination): void;

  // For filter
  setFilterString(index: number, value: string): void;
  setFilterNumber(index: number, type: 'min' | 'max', value: number): void;
  setFilterDate(index: number, range?: DateRange): void;
  addFilter(filter: DatasetFilter): void;
  updateFilter(index: number, filter: DatasetFilter): void;
  removeFilter(index: number): void;

  reset(): void;
};

export const useQueryOptionsState = create<QueryOptionState>((set) => ({
  filters: [],
  sorts: [],
  pagination: {
    limit: 20,
    offset: 0
  },
  reset() {
    set({ filters: [], sorts: [], pagination: { limit: 100, offset: 0 } });
  },
  setPagination(pagination) {
    set({ pagination });
  },
  addSort(sort) {
    set((state) => {
      return { sorts: [...state.sorts, sort] };
    });
  },
  updateSort(index, sort) {
    set((state) => {
      const newSorts = state.sorts.map((s, i) => (i === index ? sort : s));
      return { sorts: newSorts };
    });
  },
  removeSort(index) {
    set((state) => {
      const newSorts = state.sorts.filter((_, i) => i !== index);
      return { sorts: newSorts };
    });
  },
  addFilter(filter) {
    set((state) => {
      return { filters: [...state.filters, filter] };
    });
  },
  updateFilter(index, filter) {
    set((state) => {
      const newFilters = state.filters.map((f, i) => (i === index ? filter : f));
      return { filters: newFilters };
    });
  },
  removeFilter(index) {
    set((state) => {
      const newFilters = state.filters.filter((_, i) => i !== index);
      return { filters: newFilters };
    });
  },
  setFilterDate(index, range) {
    if (!range) return;
    set((state) => {
      if (index >= state.filters.length) return state;
      const newFilters = [...state.filters];
      const dateFilter = newFilters[index] as DateFilter;
      dateFilter.range = range;
      return { filters: newFilters };
    });
  },
  setFilterString(index, value) {
    set((state) => {
      if (index >= state.filters.length) return state;
      const newFilters = [...state.filters];
      const keywordFilter = newFilters[index] as KeywordFilter | TextFilter;
      if ('match' in keywordFilter) keywordFilter.match = value;
      else keywordFilter.exact = value;
      return { filters: newFilters };
    });
  },
  setFilterNumber(index, type, value) {
    set((state) => {
      if (index >= state.filters.length) return state;
      const newFilters = [...state.filters];
      const numberFilter = newFilters[index] as NumberFilter;
      numberFilter.range[type] = value;
      return { filters: newFilters };
    });
  }
}));
