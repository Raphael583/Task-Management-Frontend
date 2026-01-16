import { cn } from '@/lib/utils';

type FilterOption = 'All' | 'Not Started' | 'In Progress' | 'Completed';

interface TaskFiltersProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  taskCounts?: Record<FilterOption, number>;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export function TaskFilters({ activeFilter, onFilterChange, taskCounts }: TaskFiltersProps) {
  return (
    <div className="flex items-center p-1 bg-muted rounded-xl gap-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = taskCounts?.[filter.value];
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-200',
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filter.label}
            {count !== undefined && count > 0 && (
              <span className={cn(
                'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted-foreground/10 text-muted-foreground'
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}