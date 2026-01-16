import { Task } from '@/lib/api';
import { TaskCard } from './TaskCard';
import { Loader2, Inbox, Sparkles } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  updatingTaskId: string | null;
  deletingTaskId: string | null;
  onAdvanceState: (taskId: string, currentState: Task['state']) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  updatingTaskId,
  deletingTaskId,
  onAdvanceState,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground text-lg mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Create a task or use the AI assistant to get started
        </p>
        <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-accent text-xs text-accent-foreground">
          <Sparkles className="w-3 h-3" />
          Try: "Add a task to review the project"
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <TaskCard
          key={task._id}
          task={task}
          onAdvanceState={onAdvanceState}
          onDelete={onDelete}
          isUpdating={updatingTaskId === task._id}
          isDeleting={deletingTaskId === task._id}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}