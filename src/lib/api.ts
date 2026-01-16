const BASE_URL = 'http://localhost:3000';

export interface Task {
  _id: string;
  title: string;
  state: 'Not Started' | 'In Progress' | 'Completed';
  createdAt?: string;
}

export type AICommandResponse =
  | Task
  | Task[]
  | { message: string }
  | { error: string };

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
}

export async function getTasks(state?: string): Promise<Task[]> {
  const url = state ? `${BASE_URL}/tasks?state=${encodeURIComponent(state)}` : `${BASE_URL}/tasks`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}

export async function updateTaskState(taskId: string, state: Task['state']): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/state`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) throw new Error('Failed to update task state');
  return response.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
}

export async function runAICommand(
  command: string,
): Promise<AICommandResponse> {
  const response = await fetch(`${BASE_URL}/ai/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    throw new Error('AI command failed');
  }

  return response.json();
}
