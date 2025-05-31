import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';
import type { User } from '../types/User';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
  }),
  columnHelper.accessor('position', {
    header: 'Position',
  }),
  columnHelper.accessor('department', {
    header: 'Department',
  }),
  columnHelper.accessor('salary', {
    header: 'Salary',
    cell: (info) => `$${info.getValue()?.toLocaleString()}`,
  }),
  columnHelper.accessor('hireDate', {
    header: 'Hire Date',
    cell: (info) => new Date(info.getValue())?.toLocaleDateString(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
];

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  hasNextPage,
  fetchNextPage,
}) => {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const containerHeight = tableContainerRef.current?.clientHeight || 0;
        const containerScrollHeight = tableContainerRef.current?.scrollHeight || 0;
        const hasScroll = containerScrollHeight > containerHeight;
        
        if (firstEntry.isIntersecting && !isLoading && hasNextPage && hasScroll) {
          fetchNextPage();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, hasNextPage, fetchNextPage]);

  if (!users.length && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      ref={tableContainerRef}
      component={Paper}
      sx={{ 
        height: 400,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        position: 'relative'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div 
          ref={loadMoreRef}
          style={{ 
            width: '100%',
            height: '20px',
            position: 'relative',
            pointerEvents: 'none'
          }}
        />
      )}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </TableContainer>
  );
}; 