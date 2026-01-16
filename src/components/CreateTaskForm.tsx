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
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new task..."
        className={cn(
          'flex-1 px-4 py-3 rounded-xl border border-border bg-card',
          'text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-all duration-200'
        )}
        disabled={isCreating}
      />
      <button
        type="submit"
        disabled={!title.trim() || isCreating}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-xl font-medium',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'shadow-sm hover:shadow-md'
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
