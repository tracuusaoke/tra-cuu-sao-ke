import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useExtractDocuments } from '@/hooks/data/useExtractDocuments';
import { useQueryOptionsState } from '@/states/filter';
import { useParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const allowedItemsPerPage = [10, 20, 50, 100];

export function DatasetPagination() {
  const dataset = useParams<{ dataset: string }>().dataset;
  const { refetch: refetchDocuments, data: documents } = useExtractDocuments(dataset);

  const { setPagination, pagination } = useQueryOptionsState();

  const currentPageNumber = useMemo(() => Math.floor(pagination.offset / pagination.limit) + 1, [pagination]);
  const displayPageNumbers: number[] = useMemo(() => {
    const arr: number[] = [];
    if (currentPageNumber > 1) arr.push(currentPageNumber - 1);
    arr.push(currentPageNumber);
    if (documents.length > 0) arr.push(currentPageNumber + 1);
    return arr;
  }, [currentPageNumber, documents]);

  const handleItemsPerPageChange = useCallback(
    (value: string) => {
      const itemsPerPage = Number.parseInt(value);
      setPagination({
        ...pagination,
        limit: itemsPerPage
      });
      setTimeout(() => refetchDocuments(), 50);
    },
    [pagination, setPagination, refetchDocuments]
  );

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (pageNumber < 1) return;
      setPagination({
        ...pagination,
        offset: (pageNumber - 1) * pagination.limit
      });
      setTimeout(() => refetchDocuments(), 50);
    },
    [pagination, setPagination, refetchDocuments]
  );

  return (
    <div className='flex justify-between items-center mt-4'>
      <div className='flex items-center gap-1'>
        <Select onValueChange={handleItemsPerPageChange} value={pagination.limit.toString()}>
          <SelectTrigger className='w-20'>
            <SelectValue defaultValue={'10'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {allowedItemsPerPage.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p>dòng mỗi trang</p>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(currentPageNumber - 1)} />
          </PaginationItem>

          {currentPageNumber > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {displayPageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                isActive={currentPageNumber === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {documents.length > 0 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPageNumber + 1)} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
