# Task Management System – Frontend

This repository contains the **frontend implementation** of the Task Management System.
The frontend provides a user-friendly interface for managing tasks and interacting with the system using **natural-language AI commands**.

The application communicates with a NestJS backend through REST APIs and does not contain any business logic or state transition rules.

---

## Features

* Create, view, update, and delete tasks
* Filter tasks by state:

  * Not Started
  * In Progress
  * Completed
* Advance task states following backend-enforced rules
* Interact with tasks using natural-language AI commands
* Responsive and clean user interface

---

## Task Interaction Flow

All user actions (manual or AI-driven) follow the same backend logic:

1. User performs an action from the UI or AI input
2. Frontend sends a request to the backend API
3. Backend validates and processes the request
4. Frontend updates the UI based on backend response

The frontend does not:

* Implement state transition logic
* Directly access the database
* Override backend validations

---

## AI Command Interface

The frontend provides an input field for natural-language commands such as:

* Add a task to prepare presentation
* Start working on presentation task
* Mark presentation task as completed
* Show all completed tasks

These commands are sent to the backend AI endpoint, which interprets the intent and triggers the appropriate backend logic.

The frontend treats AI responses as **untrusted input** and updates the UI only after receiving validated responses from the backend.

---

## Tech Stack

* React
* TypeScript
* Tailwind CSS
* Vite

---

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Page-level components
├── lib/               # API interaction logic
├── hooks/             # Custom React hooks
└── styles/            # Styling and theme configuration
```

---

## Backend Integration

The frontend communicates with the backend through REST APIs.

### Backend Base URL

```
http://localhost:3000
```

Ensure the backend server is running before starting the frontend.

---

## Running the Frontend Locally

### Prerequisites

* Node.js (v18+ recommended)
* Backend server running locally

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:8080
```

---

## Backend Repository

The backend for this project is maintained separately:

Backend Repository:
[https://github.com/Raphael583/task-management-backend](https://github.com/Raphael583/task-management-backend)

---

## Design Principles

* Clear separation between UI and business logic
* Backend-driven validation and state control
* Predictable and consistent UI behavior
* AI treated as an assistive input layer only

---

## Submission Notes

* No environment files or build artifacts are included
* Frontend and backend are intentionally maintained as separate repositories
* The project is designed to work even if AI functionality is disabled

---

## Author

Raphael A.
M.Sc. Computer Science
Loyola College, Madras University

---
