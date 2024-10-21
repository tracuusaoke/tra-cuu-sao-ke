import { parse as parseCSVLine } from 'csv-parse';
import * as sha256 from 'sha256';
import { z } from 'zod';

import type { DateValue, RangeValue } from '@nextui-org/react';
import type { Transaction } from '../components/types/Transaction';

export const TCSKUtils = {
  sha256: async (data: string) => {
    return sha256.default(data);
  },
  lineToCells: async (line: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
      parseCSVLine(line, { delimiter: ',' }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cells = z.array(z.array(z.string())).safeParse(data);
          if (cells.success) {
            resolve(cells.data[0]);
          } else {
            reject(cells.error);
          }
        }
      });
    });
  },
  parseCSV: async (csv: string) => {
    const lines = csv
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const headers = await TCSKUtils.lineToCells(lines[0]);
    const rows = await Promise.all(
      lines.slice(1).map(async (line) => {
        const cells = await TCSKUtils.lineToCells(line);
        return headers.reduce(
          (acc, key, i) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [key.toLowerCase().trim()]: cells[i]
          }),
          {}
        );
      })
    );

    return rows;
  },
  dateRangeToStr: (dateRange: RangeValue<DateValue>) => {
    return `${dateRange.start.toString()} - ${dateRange.end.toString()}`;
  },
  searchUtils: {
    // date in format dd/mm/yyyy
    isDateIncludedInRange: (curDate: string, dateRange: RangeValue<DateValue>) => {
      const curRowDate = curDate.split('/').reverse().join('-'); // convert into yyyy-mm-dd
      const startDateStr = new Date(dateRange.start.toString()).toISOString().split('T')[0];
      const endDateStr = new Date(dateRange.end.toString()).toISOString().split('T')[0];

      return curRowDate >= startDateStr && curRowDate <= endDateStr;
    },
    getSimilarityToSearchContent: (searchContent: string, row: Transaction) => {
      if (searchContent.trim() === '') {
        return {
          similarity: 1,
          row
        };
      }

      const keyWords = searchContent
        .split(' ')
        .map((word) => word.toLowerCase().trim())
        .filter((word) => word.length > 0);

      // const rowToString = Object.values(row).join(" ");
      let sim = 0;
      for (const cell of Object.values(row)) {
        if (
          cell
            .toString()
            .toLowerCase()
            .trim()
            .split(' ')
            .join(' ')
            .includes(searchContent.toLowerCase().split(' ').join(' '))
        ) {
          sim = 1000;
        }
      }

      if (sim <= 0)
        for (const word in keyWords) {
          let maxSimOfCurKeyword = 0;
          const cells = Object.values(row);
          for (const cell of cells) {
            if (cell.toString().toLowerCase().trim() === word.toLowerCase().trim()) {
              maxSimOfCurKeyword = 2;
            }
            if (cell.toString().toLowerCase().includes(word)) {
              maxSimOfCurKeyword = 1;
            }
          }
          sim += maxSimOfCurKeyword;
        }
      return {
        similarity: sim,
        row
      };
    }
  }
};
