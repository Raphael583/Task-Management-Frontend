import { Task } from '@/lib/api';
import { Trash2, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onAdvanceState: (taskId: string, currentState: Task['state']) => void;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  animationDelay?: number;
}

const stateConfig = {
  'Not Started': {
    badge: 'badge-notstarted',
    next: 'In Progress' as const,
    nextLabel: 'Start',
    icon: '○',
  },
  'In Progress': {
    badge: 'badge-inprogress',
    next: 'Completed' as const,
    nextLabel: 'Complete',
    icon: '◐',
  },
  'Completed': {
    badge: 'badge-completed',
    next: null,
    nextLabel: null,
    icon: '●',
  },
};

export function TaskCard({ 
  task, 
  onAdvanceState, 
  onDelete, 
  isUpdating, 
  isDeleting,
  animationDelay = 0 
}: TaskCardProps) {
  const config = stateConfig[task.state];
  const isLoading = isUpdating || isDeleting;

  return (
    <div
      className={cn(
        'group card-surface p-4 animate-fade-up',
        'transition-all duration-200',
        isLoading && 'opacity-60 pointer-events-none'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-[15px] leading-snug mb-2">
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              config.badge
            )}>
              <span className="text-[10px]">{config.icon}</span>
              {task.state}
            </span>
            {task.createdAt && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(task.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          'flex items-center gap-1 transition-opacity duration-200',
          'opacity-0 group-hover:opacity-100',
          isLoading && 'opacity-100'
        )}>
          {config.next && (
            <button
              onClick={() => onAdvanceState(task.id, task.state)}
              disabled={isLoading}
              className="btn-primary text-sm py-1.5 px-3"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {config.nextLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="btn-danger"
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
    </div>
  );
}