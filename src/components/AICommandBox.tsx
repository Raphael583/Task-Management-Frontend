import { useState } from 'react';
import { Sparkles, Loader2, Send, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICommandBoxProps {
  onRunCommand: (command: string) => Promise<void>;
  isRunning: boolean;
  lastResult: string | null;
  lastError: string | null;
}

const suggestions = [
  { text: 'Add a task to prepare presentation', icon: '📝' },
  { text: 'Start working on presentation', icon: '▶️' },
  { text: 'Mark presentation as completed', icon: '✅' },
  { text: 'Show all completed tasks', icon: '📋' },
];

export function AICommandBox({ onRunCommand, isRunning, lastResult, lastError }: AICommandBoxProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isRunning) return;
    
    await onRunCommand(command.trim());
    setCommand('');
  };

  return (
    <div className="card-surface overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl ai-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">AI Command Assistant</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Control your tasks using natural language
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-xs font-medium text-accent-foreground">
            <Zap className="w-3 h-3" />
            Powered by AI
          </div>
        </div>
      </div>

      {/* Command Input */}
      <div className="px-6 pb-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type a command like 'Add a task to review code'..."
              className={cn(
                'w-full px-5 py-4 pr-28 rounded-xl',
                'bg-background border-2 border-border',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
                'transition-all duration-200',
                'text-[15px]'
              )}
              disabled={isRunning}
            />
            <button
              type="submit"
              disabled={!command.trim() || isRunning}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'ai-gradient text-white font-medium text-sm',
                'hover:opacity-90 transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-sm'
              )}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Run</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div className="px-6 pb-4">
        <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.text}
              onClick={() => setCommand(suggestion.text)}
              disabled={isRunning}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                'bg-muted text-sm text-muted-foreground',
                'hover:bg-accent hover:text-accent-foreground',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <span>{suggestion.icon}</span>
              <span className="truncate max-w-[200px]">{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result/Error Display */}
      {(lastError || lastResult) && (
        <div className="px-6 pb-6">
          {lastError ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive text-sm">Command failed</p>
                <p className="text-sm text-destructive/80 mt-0.5">{lastError}</p>
              </div>
            </div>
          ) : lastResult && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-success text-sm">Command executed</p>
                <p className="text-sm text-success/80 mt-0.5">{lastResult}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}