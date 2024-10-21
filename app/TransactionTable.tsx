import React, { useEffect, useState } from 'react';

import { parseDate } from '@internationalized/date';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { DateRangePicker } from '@nextui-org/react';

import type { DateValue, RangeValue } from '@nextui-org/react';
import type { Row } from './row';

interface Column {
  id: 'id' | 'TNXDate' | 'DocNo' | 'Debit' | 'Credit' | 'Balance' | 'Transactions in Detail';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: string | number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'TNXDate', label: 'Ngày giao dịch', minWidth: 120 },
  { id: 'DocNo', label: 'Số chứng từ', minWidth: 100 },
  { id: 'Debit', label: 'Chi', minWidth: 100, align: 'right' },
  { id: 'Credit', label: 'Thu', minWidth: 100, align: 'right' },
  { id: 'Balance', label: 'Số dư', minWidth: 100, align: 'right' },
  {
    id: 'Transactions in Detail',
    label: 'Mô tả',
    minWidth: 200
  }
];

export default function TransactionTable({ allRows }: { allRows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(allRows);
  const [searched, setSearched] = useState<string>('');

  useEffect(() => {
    setRows(allRows);
  }, [allRows]);

  // const [openDateRangePicker, setOpenDateRangePicker] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<RangeValue<DateValue>>({
    start: parseDate('2024-09-01'),
    end: parseDate('2024-09-10')
  });

  // const toggleDateRangePicker = () =>
  // setOpenDateRangePicker(!openDateRangePicker);

  const requestSearch = (searchContent: string, withDateRange?: RangeValue<DateValue>) => {
    const filteredByDateRows = allRows.filter((row) => {
      // DD-MM-YYYY
      // convert to YYYY-MM-DD
      const curRowDate = row.TNXDate.split('/').reverse().join('-');
      const startDateStr = new Date((withDateRange ?? dateRange).start.toString())
        .toISOString()
        .split('T')[0];
      const endDateStr = new Date((withDateRange ?? dateRange).end.toString()).toISOString().split('T')[0];

      return curRowDate >= startDateStr && curRowDate <= endDateStr;
    });

    const keyWords = searchContent.split(' ').map((word) => word.toLowerCase().trim());

    const results: Array<{
      similarity: number;
      row: Row;
    }> = filteredByDateRows
      .map((row) => {
        // const rowToString = Object.values(row).join(" ");
        let sim = 0;
        const cells = Object.values(row);
        for (const cell of cells) {
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
          for (const word of keyWords) {
            let maxSimOfCurKeyword = 0;
            const cells = Object.values(row);
            for (const cell of cells) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              // const curSim = leven(word, cell.toString()) / word.length;
              // if (curSim > maxSimOfCurKeyword) {
              //   maxSimOfCurKeyword = curSim;
              // }

              if (cell.toString().toLowerCase().trim() === word.toLowerCase().trim()) {
                maxSimOfCurKeyword = 2;
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
    // alert("Search completed");
    setRows(results.map((result) => result.row));
  };

  // const cancelSearch = () => {
  //   setSearched("");
  //   requestSearch("");
  // };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0'>
        <TextField
          id='outlined-basic'
          label='Nhập nội dung tìm kiếm'
          className='w-full md:flex-1 md:pr-[20px]' // Full width on small screens
          variant='outlined'
          value={searched}
          onChange={(e) => setSearched(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              requestSearch(searched);
            }
          }}
        />
        <div className='flex'>
          <DateRangePicker
            label='Stay duration'
            className='w-full md:max-w-xs'
            onChange={(range) => {
              setDateRange(range);
              requestSearch(searched, range);
            }}
            value={dateRange}
          />
          <Button
            variant='text'
            className='p-2'
            onClick={() =>
              setDateRange({
                start: parseDate('2024-09-01'),
                end: parseDate('2024-09-10')
              })
            }
          >
            Reset
          </Button>
        </div>
      </div>
      <div />
      <div className='mb-8 mt-4 flex justify-center'>
        <Button variant='contained' onClick={() => requestSearch(searched)}>
          Tra cứu
        </Button>
      </div>

      <TableContainer className='max-h-[600px]'>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  <div className='font-bold'>{column.label}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
