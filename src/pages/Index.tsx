import { useState, useEffect, useCallback } from 'react';
import { ListTodo, Sparkles } from 'lucide-react';
import { Task, getTasks, createTask, updateTaskState, deleteTask, runAICommand } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskList } from '@/components/TaskList';
import { AICommandBox } from '@/components/AICommandBox';
import { ToastContainer, useToasts } from '@/components/Toast';

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
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isRunningAI, setIsRunningAI] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);
  
  const toast = useToasts();

  // Fetch all tasks for counts
  const fetchAllTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setAllTasks(data);
    } catch (err) {
      console.error('Error fetching all tasks:', err);
    }
  }, []);

  const fetchTasks = useCallback(async (filter: FilterOption, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const stateParam = filter === 'All' ? undefined : filter;
      const data = await getTasks(stateParam);
      setTasks(data);
      await fetchAllTasks();
    } catch (err) {
      toast.error('Failed to load tasks', 'Please check if the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllTasks]);

  useEffect(() => {
    fetchTasks(activeFilter);
  }, [activeFilter]);

  // Calculate task counts
  const taskCounts: Record<FilterOption, number> = {
    'All': allTasks.length,
    'Not Started': allTasks.filter(t => t.state === 'Not Started').length,
    'In Progress': allTasks.filter(t => t.state === 'In Progress').length,
    'Completed': allTasks.filter(t => t.state === 'Completed').length,
  };

  const handleCreateTask = async (title: string) => {
    setIsCreating(true);
    try {
      await createTask(title);
      await fetchTasks(activeFilter, false);
      toast.success('Task created', `"${title}" has been added to your list.`);
    } catch (err) {
      toast.error('Failed to create task', 'Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAdvanceState = async (taskId: string, currentState: Task['state']) => {
    const nextState = getNextState(currentState);
    if (!nextState) return;

    setUpdatingTaskId(taskId);
    try {
      await updateTaskState(taskId, nextState);
      await fetchTasks(activeFilter, false);
      toast.success('Task updated', `Status changed to "${nextState}".`);
    } catch (err) {
      toast.error('Failed to update task', 'Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      await deleteTask(taskId);
      await fetchTasks(activeFilter, false);
      toast.success('Task deleted', 'The task has been removed.');
    } catch (err) {
      toast.error('Failed to delete task', 'Please try again.');
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

    //  SHOW_TASKS → Task[]
    if (Array.isArray(response)) {
      setTasks(response);
      setAIResult(`Showing ${response.length} task(s)`);
      toast.success('Tasks loaded');
      return;
    }

    //  ERROR OBJECT
    if ('error' in response) {
      setAIError(response.error);
      toast.error('AI command failed', response.error);
      return;
    }

    //  MESSAGE OBJECT
    if ('message' in response) {
      setAIResult(response.message);
      toast.success('AI command executed', response.message);
      await fetchTasks(activeFilter, false);
      return;
    }

    //  TASK OBJECT (CREATE / UPDATE)
    await fetchTasks(activeFilter, false);
    toast.success('AI command executed successfully');
  } catch (err) {
    const errorMsg = 'AI command failed. Please try again.';
    setAIError(errorMsg);
    toast.error('AI command failed', 'The AI service may be unavailable.');
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
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tasks Section */}
        <section className="card-surface p-6 animate-fade-up">
          {/* Section Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your tasks using structured workflows
              </p>
            </div>
          </div>

          {/* Create Task Form */}
          <div className="mb-6">
            <CreateTaskForm onCreateTask={handleCreateTask} isCreating={isCreating} />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TaskFilters 
              activeFilter={activeFilter} 
              onFilterChange={handleFilterChange}
              taskCounts={taskCounts}
            />
          </div>

          {/* Task List */}
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

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Task Management System • Built with{' '}
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </p>
        </footer>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />
    </div>
  );
};

export default Index;