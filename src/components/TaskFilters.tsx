import { cn } from '@/lib/utils';

type FilterOption = 'All' | 'Not Started' | 'In Progress' | 'Completed';

interface TaskFiltersProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: FilterOption[] = ['All', 'Not Started', 'In Progress', 'Completed'];

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'border border-border hover:border-primary/50',
            activeFilter === filter
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-foreground hover:bg-accent'
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
