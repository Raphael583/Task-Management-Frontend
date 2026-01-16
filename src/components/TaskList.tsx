import { Task } from '@/lib/api';
import { TaskItem } from './TaskItem';
import { Loader2, ClipboardList } from 'lucide-react';

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
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onAdvanceState={onAdvanceState}
          onDelete={onDelete}
          isUpdating={updatingTaskId === task.id}
          isDeleting={deletingTaskId === task.id}
        />
      ))}
    </div>
  );
}
