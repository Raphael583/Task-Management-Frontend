import { useState, useEffect, useCallback } from 'react';
import { CheckSquare } from 'lucide-react';
import { Task, getTasks, createTask, updateTaskState, deleteTask, runAICommand } from '@/lib/api';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskList } from '@/components/TaskList';
import { AICommandBox } from '@/components/AICommandBox';

type FilterOption = 'All' | 'Not Started' | 'In Progress' | 'Completed';

const getNextState = (currentState: Task['state']): Task['state'] | null => {
  const transitions: Record<Task['state'], Task['state'] | null> = {
    'Not Started': 'In Progress',
    'In Progress': 'Completed',
    'Completed': null,
  };
  return transitions[currentState];
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isRunningAI, setIsRunningAI] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filter: FilterOption) => {
    setIsLoading(true);
    setError(null);
    try {
      const stateParam = filter === 'All' ? undefined : filter;
      const data = await getTasks(stateParam);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please check if the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(activeFilter);
  }, [activeFilter, fetchTasks]);

  const handleCreateTask = async (title: string) => {
    setIsCreating(true);
    setError(null);
    try {
      await createTask(title);
      await fetchTasks(activeFilter);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAdvanceState = async (taskId: string, currentState: Task['state']) => {
    const nextState = getNextState(currentState);
    if (!nextState) return;

    setUpdatingTaskId(taskId);
    setError(null);
    try {
      await updateTaskState(taskId, nextState);
      await fetchTasks(activeFilter);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    setError(null);
    try {
      await deleteTask(taskId);
      await fetchTasks(activeFilter);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleRunAICommand = async (command: string) => {
    setIsRunningAI(true);
    setAIResult(null);
    setAIError(null);
    try {
      const response = await runAICommand(command);
      if (response.error) {
        setAIError(response.error);
      } else {
        setAIResult(response.message || 'Command executed successfully');
        await fetchTasks(activeFilter);
      }
    } catch (err) {
      setAIError('AI command failed. Please try again.');
      console.error('Error running AI command:', err);
    } finally {
      setIsRunningAI(false);
    }
  };

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Task Management System</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Global Error */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Manual Task Management Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Manual Task Management</h2>
            <p className="text-sm text-muted-foreground">Create and manage your tasks</p>
          </div>

          <CreateTaskForm onCreateTask={handleCreateTask} isCreating={isCreating} />

          <TaskFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            updatingTaskId={updatingTaskId}
            deletingTaskId={deletingTaskId}
            onAdvanceState={handleAdvanceState}
            onDelete={handleDeleteTask}
          />
        </section>

        {/* AI Command Section */}
        <section>
          <AICommandBox
            onRunCommand={handleRunAICommand}
            isRunning={isRunningAI}
            lastResult={aiResult}
            lastError={aiError}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
