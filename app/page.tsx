'use client';

import './layout.css';

import { useEffect, useState } from 'react';

import { Container, Typography } from '@material-ui/core';
import { NextUIProvider } from '@nextui-org/react';

import type { Transaction, TransactionQuery } from '../components/types/Transaction';

import { TransactionValidator } from '../components/types/Transaction';
import { AggregatedDataTable } from './AggregatedDataTable';
import { TCSKUtils } from './TCKSUtils';

const toCacheKey = (index: number) =>
  `transactions/Agribank-1500201113838-20240901-20240912_parsed_${index.toString().padStart(3, '0')}.csv`;

export default function Home() {
  const [allRows, setAllRows] = useState<Array<Transaction>>([]);

  // load static csv files on page load and cache to local storage
  useEffect(() => {
    const todos = Array.from({ length: 2 }, (_, i) => i).map((i) => {
      const key = toCacheKey(i + 1);
      return fetch(`/${key}`)
        .then((res) => res.text())
        .then((data) => {
          return TCSKUtils.parseCSV(data);
        });
      // .catch((err) => console.error(`Failed to fetch ${key}: `, err));
    });

    if (todos.length === 0) return;
    Promise.all(todos).then((res) => {
      const rows = res
        .reduce((acc, val) => acc.concat(val), [])
        .map((row) => ({
          txsId: Math.random().toString(),
          ...row
        }));

      const loadedTransactions = rows
        .map((row) => {
          const parsed = TransactionValidator.safeParse(row);
          if (parsed.success) {
            return parsed.data;
          }
          return null;
        })
        .filter((row) => row !== null);

      setAllRows(loadedTransactions);
    });
  }, []);

  const queryHandler = async (query: TransactionQuery) => {
    const searchContent = query.keyword ?? '';
    const filteredByDateRows = allRows.filter((row) => {
      // DD-MM-YYYY
      // convert to YYYY-MM-DD
      const curRowDate = row.date.split('/').reverse().join('-');

      if (!query.dateRangeFilter) {
        return true;
      }
      const startDateStr = new Date(query.dateRangeFilter.start.toString()).toISOString().split('T')[0];
      const endDateStr = new Date(query.dateRangeFilter.end.toString()).toISOString().split('T')[0];

      return curRowDate >= startDateStr && curRowDate <= endDateStr;
    });

    const keyWords = searchContent
      .split(' ')
      .filter((x) => x.trim().length > 0)
      .map((word) => word.toLowerCase().trim());

    const results: Array<{
      similarity: number;
      row: Transaction;
    }> = filteredByDateRows
      .map((row) => {
        let sim = 0;
        const cells = Object.values(row);

        for (const cell of cells) {
          if (
            cell
              .toString()
              .toLowerCase()
              .trim()
              .split(' ')
              .filter((x) => x.trim().length > 0)
              .join(' ')
              .includes(
                searchContent
                  .toLowerCase()
                  .split(' ')
                  .filter((x) => x.trim().length > 0)
                  .join(' ')
              )
          ) {
            sim = 1000;
          }
        }

        if (sim <= 0)
          for (const word of keyWords) {
            let maxSimOfCurKeyword = 0;
            const cells = Object.values(row);

            for (const cell of cells) {
              if (cell.toString().toLowerCase().trim() === word.toLowerCase().trim()) {
                maxSimOfCurKeyword = 4;
              }
              if (cell.toString().toLowerCase().includes(word)) {
                maxSimOfCurKeyword = 1;
              }
            }
            sim += maxSimOfCurKeyword;
          }
        // const sim = similarity(searchContent, rowToString) as number;
        return {
          similarity: sim,
          row
        };
      })
      .filter((result) => searchContent.trim().length <= 0 || result.similarity > 0);
    // sort by similarity desc
    results.sort((a, b) => b.similarity - a.similarity);
    return results.map((result) => result.row);
  };

  return (
    <NextUIProvider>
      <main className='min-h-screen w-full bg-white bg-fixed selection:bg-zinc-300 selection:text-black'>
        <Container>
          <div className='py-[50px]'>
            <Typography variant='h4' className='text-center'>
              Tra cứu thông tin sao kê từ thiện
            </Typography>
          </div>
          <AggregatedDataTable sampleFetcher={queryHandler} />
          {/* <TransactionTable allRows={allRows} /> */}
        </Container>
        {/* </div> */}
        <footer className='container mt-10 grid place-items-center pb-4 text-sm text-neutral-400'>
          <span className='flex items-center gap-1'>
            &copy;
            <span>{new Date().getFullYear()}</span>
            <a href='https://github.com/galin-chung-nguyen' target='_blank' rel='noreferrer'>
              galin-chung-nguyen
            </a>
          </span>
        </footer>
      </main>
    </NextUIProvider>
  );
}
