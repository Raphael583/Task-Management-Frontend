import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTaskFormProps {
  onCreateTask: (title: string) => Promise<void>;
  isCreating: boolean;
}

export function CreateTaskForm({ onCreateTask, isCreating }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isCreating) return;
    
    await onCreateTask(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task title…"
          className="input-field pr-12"
          disabled={isCreating}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ↵
          </kbd>
        </div>
      </div>
      <button
        type="submit"
        disabled={!title.trim() || isCreating}
        className={cn(
          'btn-primary px-5',
          isCreating && 'animate-pulse-soft'
        )}
      >
        {isCreating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </>
        )}
      </button>
    </form>
  );
}