import { Task } from '@/lib/api';
import { Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onAdvanceState: (taskId: string, currentState: Task['state']) => void;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const stateConfig = {
  'Not Started': {
    badge: 'bg-state-notstarted text-state-notstarted-foreground',
    next: 'In Progress' as const,
    nextLabel: 'Start',
  },
  'In Progress': {
    badge: 'bg-state-inprogress text-state-inprogress-foreground',
    next: 'Completed' as const,
    nextLabel: 'Complete',
  },
  'Completed': {
    badge: 'bg-state-completed text-state-completed-foreground',
    next: null,
    nextLabel: null,
  },
};

export function TaskItem({ task, onAdvanceState, onDelete, isUpdating, isDeleting }: TaskItemProps) {
  const config = stateConfig[task.state];
  const isLoading = isUpdating || isDeleting;

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 bg-card rounded-xl border border-border',
        'transition-all duration-200 hover:shadow-md hover:border-primary/30',
        isLoading && 'opacity-60 pointer-events-none'
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{task.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', config.badge)}>
            {task.state}
          </span>
          {task.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {config.next && (
          <button
            onClick={() => onAdvanceState(task.id, task.state)}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {config.nextLabel}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          disabled={isLoading}
          className={cn(
            'p-2 rounded-lg text-muted-foreground',
            'hover:bg-destructive/10 hover:text-destructive transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Delete task"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
