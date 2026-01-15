import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick,
  emptyMessage = 'No data available',
  className = '' 
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;
    
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  return (
    <div className={`rounded-lg border border-border/50 bg-card/30 overflow-hidden ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)}
                className={`text-muted-foreground font-medium ${column.className || ''}`}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(String(column.key))}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    data-testid={`sort-${String(column.key)}`}
                  >
                    {column.header}
                    <SortIcon columnKey={String(column.key)} />
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-32 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, index) => (
              <motion.tr
                key={item.id || index}
                className={`border-border/30 transition-colors ${onRowClick ? 'cursor-pointer hover-elevate' : 'hover:bg-muted/30'}`}
                onClick={() => onRowClick?.(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                data-testid={`row-${item.id || index}`}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.key)} 
                    className={column.className}
                  >
                    {column.render 
                      ? column.render(item) 
                      : String(item[column.key as keyof T] ?? '-')
                    }
                  </TableCell>
                ))}
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
