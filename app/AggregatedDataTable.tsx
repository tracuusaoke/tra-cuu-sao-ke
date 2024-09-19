import React, { useCallback, useEffect, useMemo, useState } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button, Input, Pagination, Spinner } from "@nextui-org/react";
import { GoChevronDown, GoSearch } from "react-icons/go";

import type {
  KeyboardEvent,
  Transaction,
  TransactionQuery,
} from "./types/Transaction";
import type { DateValue, RangeValue, SortDescriptor } from "@nextui-org/react";
import type { Key } from "@react-types/shared";

import { CustomDateRangePicker } from "./components/DateRangePicker";
import { DEFAULT_DATE_RANGE } from "./constants";
import { transactionColumns } from "./types/Transaction";

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const INITIAL_VISIBLE_COLUMNS = [
  // all transactionColumns
  "pageid",
  "date",
  "time",
  "documentnumber",
  "referencenumber",
  "transactiondetails",
  "debitamount",
  "creditamount",
  "balance",
  "offsetaccount",
];

type KeySelector = "all" | Iterable<Key>;

export function AggregatedDataTable({
  sampleFetcher,
}: {
  sampleFetcher: (query: TransactionQuery) => Promise<Array<Transaction>>;
}) {
  const [dateRange, setDateRange] =
    useState<RangeValue<DateValue>>(DEFAULT_DATE_RANGE);
  const [filterValue, setFilterValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // New state to store the committed keyword
  const [visibleColumns, setVisibleColumns] = useState<KeySelector>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortDescriptor, _setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<Array<Transaction>>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch data from sampleFetcher based on current filters
  const fetchTransactions = useCallback(async () => {
    setIsFetching(true);
    setFilteredItems([]);
    try {
      const query: TransactionQuery = {
        keyword: searchKeyword, // Use searchKeyword instead of filterValue
        dateRangeFilter: dateRange,
        page,
        pageSize: rowsPerPage,
        sortBy: sortDescriptor.column.toString().toLowerCase(),
        sortDirection:
          sortDescriptor.direction === "ascending" ? "asc" : "desc",
      };

      const fetchedData = await sampleFetcher(query);
      setFilteredItems(fetchedData);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setIsFetching(false);
    }
  }, [
    searchKeyword,
    dateRange,
    page,
    rowsPerPage,
    sortDescriptor,
    sampleFetcher,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const itemsInPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, page, rowsPerPage]);

  const handleDateRangeChange = useCallback(
    (newRange: RangeValue<DateValue>) => {
      setDateRange(newRange);
    },
    [],
  );

  const resetDateRange = useCallback(() => {
    setDateRange(DEFAULT_DATE_RANGE);
  }, []);

  // Trigger fetch when filters, sorting, or pagination changes (but not for keyword)
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return transactionColumns;
    return transactionColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1); // Reset to page 1 when changing rows per page
    },
    [],
  );

  // Update filter value (without triggering search)
  const onSearchInputChange = (value: string) => {
    setFilterValue(value);
  };

  // Execute the search when the user clicks the button
  const handleSearch = useCallback(() => {
    setSearchKeyword(filterValue); // Commit the search
    setPage(1); // Reset page to 1 when a new search is triggered
  }, [filterValue]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setSearchKeyword(""); // Clear the search keyword
    setPage(1); // Reset page to 1 when clearing search
  }, []);

  // Derived sorted and paginated data from filteredItems
  const sortedItems = useMemo(() => {
    // return [...itemsInPage].sort((a, b) => {
    //   const first: string = a[sortDescriptor.column] as string;
    //   const second: string = b[sortDescriptor.column] as string;
    //   const cmp =
    //     first < second ? -1
    //     : first > second ? 1
    //     : 0;
    //   return sortDescriptor.direction === "descending" ? -cmp : cmp;
    // });
    return [...itemsInPage];
  }, [itemsInPage]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Input
            isClearable
            className="w-full flex-1"
            placeholder="Search by name..."
            startContent={<GoSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchInputChange}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div className="flex items-center gap-3">
            <CustomDateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              onReset={resetDateRange}
            />
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button
                  endContent={<GoChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
                items={transactionColumns}
              >
                {(column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <Button
          isLoading={isFetching}
          color="secondary"
          spinner={<Spinner />}
          onClick={handleSearch}
        >
          {isFetching ? "Searching..." : "Search"}
        </Button>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {filteredItems.length} transactions
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              {[10, 50, 100, 200].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <TableContainer className="max-h-[600px]">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headerColumns.map((column) => (
                <TableCell
                  key={column.uid}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <div className="font-bold">{column.name}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.txsId}>
                  {headerColumns.map((column) => {
                    const cellValue = row[column.uid] as string;
                    return (
                      <TableCell
                        key={row.txsId + "-" + column.uid}
                        align={column.align}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(+event.target.value);
          setPage(1);
        }}
      /> */}

      <div className="flex justify-center pt-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
