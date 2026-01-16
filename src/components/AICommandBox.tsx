import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICommandBoxProps {
  onRunCommand: (command: string) => Promise<void>;
  isRunning: boolean;
  lastResult: string | null;
  lastError: string | null;
}

export function AICommandBox({ onRunCommand, isRunning, lastResult, lastError }: AICommandBoxProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isRunning) return;
    
    await onRunCommand(command.trim());
    setCommand('');
  };

  const suggestions = [
    'Add a task to prepare presentation',
    'Start working on presentation',
    'Mark presentation as completed',
    'Show all completed tasks',
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-ai-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Command</h2>
          <p className="text-sm text-muted-foreground">Use natural language to manage tasks</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type a command like 'Add a task to review code'..."
            className={cn(
              'flex-1 px-4 py-3 rounded-xl border border-border bg-background',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ai/20 focus:border-ai',
              'transition-all duration-200'
            )}
            disabled={isRunning}
          />
          <button
            type="submit"
            disabled={!command.trim() || isRunning}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium',
              'bg-ai-gradient text-white',
              'hover:opacity-90 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'shadow-sm hover:shadow-md'
            )}
          >
            {isRunning ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setCommand(suggestion)}
            disabled={isRunning}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-muted text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {lastError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {lastError}
        </div>
      )}

      {lastResult && !lastError && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
          {lastResult}
        </div>
      )}
    </div>
  );
}
