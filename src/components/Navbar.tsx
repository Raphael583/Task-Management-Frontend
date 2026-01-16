import { CheckSquare, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground leading-tight">
                Task Management System
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight hidden sm:block">
                Powered by intelligent workflows
              </span>
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-accent-foreground">AI-Assisted</span>
          </div>
        </div>
      </div>
    </header>
  );
}