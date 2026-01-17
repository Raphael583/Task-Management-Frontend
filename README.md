# Task Management System with AI Assistance

## Overview

This project is a full-stack **Task Management System** that allows users to create, manage, and track tasks through predefined states.
It also includes an **AI-powered command assistant** that understands natural language commands such as:

* Add a task
* Start working on a task
* Mark a task as completed
* Show all completed / in-progress / not-started tasks

The system is designed with a clear separation of concerns between frontend and backend, with all business logic and validation handled on the backend.

---

## Tech Stack

### Backend

* **NestJS** (Node.js framework)
* **MongoDB** with **Mongoose**
* **Google Gemini API** (AI command interpretation)

### Frontend

* **React** (Vite + TypeScript)
* **Tailwind CSS**
* **Fetch API** for backend communication

---

## High-Level Architecture

```
Frontend (React)
   |
   |  REST API (HTTP / JSON)
   |
Backend (NestJS)
   |
   |  Mongoose ODM
   |
MongoDB
```

### Architecture Highlights

* Frontend handles UI rendering and user interactions only
* Backend enforces all rules related to task state transitions
* AI logic lives entirely on the backend
* Frontend never directly modifies task state logic

---

## Task State Design

Each task follows a strict state machine implemented on the backend.

### Task States

* **NOT_STARTED**
* **IN_PROGRESS**
* **COMPLETED**

### Allowed Transitions

| From        | To          |
| ----------- | ----------- |
| NOT_STARTED | IN_PROGRESS |
| IN_PROGRESS | COMPLETED   |

Invalid transitions are rejected at the backend level.

### Why This Design

* Prevents inconsistent task states
* Keeps business rules centralized
* Makes the system predictable and scalable

---

## Backend Design

### Core Modules

* `TasksModule` – Task CRUD and state management
* `AiModule` – AI command interpretation and execution
* `DatabaseModule` – MongoDB connection

### Task Handling

* Tasks are stored in MongoDB
* All state changes are validated in `TasksService`
* Invalid state changes return proper HTTP errors

### API Endpoints

* `POST /tasks` – Create task
* `GET /tasks` – Fetch all tasks
* `GET /tasks?state=COMPLETED` – Fetch filtered tasks
* `PATCH /tasks/:id/state` – Update task state
* `DELETE /tasks/:id` – Delete task
* `POST /ai/command` – Execute AI command

---

## AI Integration Approach

### AI Flow

1. User enters a natural language command in the UI
2. Frontend sends the command to `/ai/command`
3. Backend interprets intent using:

   * Rule-based parsing (deterministic)
   * Optional Gemini API for advanced interpretation
4. Backend maps intent to a concrete action:

   * CREATE_TASK
   * UPDATE_TASK_STATE
   * SHOW_TASKS
5. Action is executed using existing task services
6. Result is returned to the frontend

### Why AI Is Backend-Driven

* Prevents frontend manipulation
* Ensures consistent behavior
* Keeps AI logic secure and testable

---

## Frontend Design

### Key Features

* Task list with filters (All / Not Started / In Progress / Completed)
* Add, update, and delete tasks
* AI command input with execution feedback
* Real-time UI updates after AI actions

### Frontend Responsibilities

* Render task data received from backend
* Trigger API calls
* Update UI state based on backend responses

### AI Command UI Behavior

* AI commands do not directly modify UI
* Backend returns task data or messages
* Frontend updates task list accordingly

---

## Key Design Decisions

### 1. Backend-First Validation

All task rules are enforced on the backend to prevent invalid states.

### 2. Deterministic AI Commands

AI commands are converted into structured actions instead of free-form execution.

### 3. Stateless Frontend

Frontend does not store business rules or task logic.

### 4. Clear Separation of Concerns

Each layer (UI, API, DB, AI) has a single responsibility.

---

## How to Run the Project

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:8080`

---

## Conclusion

This project demonstrates:

* Clean backend architecture with enforced business rules
* Structured task state management
* Practical AI integration for real-world usage
* A responsive frontend consuming backend-driven logic

The system is designed to be scalable, maintainable, and secure while showcasing intelligent task automation.

---

Just tell me what you want next.
