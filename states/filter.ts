import type { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type NumberRange = { min: number; max: number };

export type DatasetFilter = Record<string, NumberRange | DateRange | string | boolean>;

type FilterState = {
  filter: DatasetFilter;
  setString(fieldName: string, value: string): void;
  setNumber(fieldName: string, type: 'min' | 'max', value: number): void;
  setDate(fieldName: string, range?: DateRange): void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filter: {},
  setDate(fieldName, range) {
    if (range) {
      set((state) => ({ filter: { ...state.filter, [fieldName]: range } }));
    }
  },
  setString(fieldName, value) {
    set((state) => ({ filter: { ...state.filter, [fieldName]: value } }));
  },
  setNumber(fieldName, type, value) {
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
