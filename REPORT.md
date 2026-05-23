# MERN Stack Internship Assessment Report
**Project Name**: Spaciact - Task Management System  
**Organization**: SpacECE India Foundation  
**Candidate Workspace**: MERN Stack Internship Submission  

---

## 1. Project Description
**Spaciact** is a modern, high-performance, and responsive **Task Management System** built on the MERN Stack (MongoDB, Express.js, React, Node.js). It provides a secure, multi-user workspace where individuals can register, authenticate, and manage their personal daily tasks. 

### Core Features:
*   **Secure User Authentication**: Encrypted password storage using `bcryptjs` and stateless session management with JSON Web Tokens (JWT).
*   **Task CRUD Operations**: Complete control to Create, Read, Update, and Delete tasks.
*   **Interactive Stats Section**: Dynamic counts indicating Total, Pending, In-Progress, and Completed tasks, coupled with an overall project completion progress bar.
*   **Search and Filter Controls**: Live case-insensitive search (on titles and descriptions), status filtering, and priority filtering.
*   **Custom Sorting Options**: Tasks can be sorted by creation date or due date (ascending/descending).
*   **Smart Overdue Detection**: Automatically calculates and visually flags tasks that have passed their due date but are not yet completed.
*   **Premium Custom UI**: Designed with glassmorphic elements, modern gradients, CSS animations, custom scrollbars, and fully responsive layouts.

---

## 2. Technologies Used

### Backend Stack:
*   **Node.js**: Asynchronous event-driven JavaScript runtime environment.
*   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js REST API construction.
*   **MongoDB**: Document-based, distributed NoSQL database for flexible data schemas.
*   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
*   **jsonwebtoken (JWT)**: Security token transmission for stateless user authentication.
*   **bcryptjs**: Blowfish-based password-hashing algorithm for securing user credentials.

### Frontend Stack:
*   **React.js (Vite)**: Component-based client framework built on a lightning-fast build tool.
*   **React Router Dom v6**: Client-side declarative routing.
*   **Axios**: Promise-based HTTP client for executing secure API calls to the Express server.
*   **Lucide React**: Premium, modern SVG-based iconography.
*   **Vanilla CSS**: Clean custom styling utilizing CSS Variables, Flexbox/Grid, transitions, and media queries.

---

## 3. Directory Layout (Monorepo)
```
spacece  intern/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Signup/Login logic
│   │   └── taskController.js     # Task CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User DB Model
│   │   └── Task.js               # Task DB Model
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routing (/api/auth)
│   │   └── taskRoutes.js         # Task routing (/api/tasks)
│   ├── .env.example              # Sample environment config
│   ├── .env                      # Connection secrets configuration
│   ├── package.json              # Backend package configuration
│   └── server.js                 # Server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation controls & active user profile
│   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   ├── StatsSection.jsx  # Task summary metrics & progress bar
│   │   │   ├── TaskCard.jsx      # Individual task card layout
│   │   │   └── TaskFormModal.jsx # Add/Edit modal form
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global Auth session state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main workspace, search, filters & grid
│   │   │   ├── Login.jsx         # Sign-in panel
│   │   │   └── Register.jsx      # Account creation panel
│   │   ├── App.jsx               # Routes setup & layout wrapper
│   │   ├── index.css             # Premium Vanilla CSS design system
│   │   └── main.jsx              # React root mount script
│   ├── index.html                # Entry HTML & Google Fonts loading
│   ├── package.json              # Frontend package configuration
│   └── vite.config.js            # Vite bundler & API proxy configuration
├── package.json                  # Root monorepo workspace package.json
└── REPORT.md                     # This submission documentation file
```

---

## 4. Database Architecture

### User Model (`User.js` Schema):
| Field | Type | Required | Unique | Details |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | No | Trimmed user name |
| `email` | String | Yes | Yes | Lowercased, regex validated email format |
| `password` | String | Yes | No | Hashed using `bcryptjs` with salt rounds (10) |
| `timestamps` | Date | Auto | No | Includes `createdAt` and `updatedAt` |

### Task Model (`Task.js` Schema):
| Field | Type | Required | Reference | Details |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | `User` | Maps task ownership to a specific User |
| `title` | String | Yes | None | Task name, max 100 characters |
| `description` | String | No | None | Details, max 500 characters |
| `status` | String | Yes | None | Enum: `['Pending', 'In Progress', 'Completed']` (Default: `Pending`) |
| `priority` | String | Yes | None | Enum: `['Low', 'Medium', 'High']` (Default: `Medium`) |
| `dueDate` | Date | Yes | None | Task target completion date |
| `timestamps` | Date | Auto | None | Includes `createdAt` and `updatedAt` |

---

## 5. REST API Documentation

All request bodies must be formatted as `application/json`. Protected endpoints require a valid JWT passed in the request header as: `Authorization: Bearer <token>`.

### Authentication Endpoints:

#### 1. Register User
*   **Route**: `POST /api/auth/register`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603f7e1b5cf3c94d0c9f1a23",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

#### 2. Authenticate / Login User
*   **Route**: `POST /api/auth/login`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603f7e1b5cf3c94d0c9f1a23",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

#### 3. Get Logged-in User Profile
*   **Route**: `GET /api/auth/me`
*   **Access**: Protected (Requires JWT)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603f7e1b5cf3c94d0c9f1a23",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "createdAt": "2026-05-23T11:00:00.000Z",
        "updatedAt": "2026-05-23T11:00:00.000Z"
      }
    }
    ```

---

### Task Endpoints:

#### 1. Retrieve User Tasks
*   **Route**: `GET /api/tasks`
*   **Access**: Protected (Requires JWT)
*   **Query Parameters (Optional)**:
    *   `search`: Text search string matched against title/description.
    *   `status`: Filter by status (`Pending`, `In Progress`, `Completed`).
    *   `priority`: Filter by priority (`Low`, `Medium`, `High`).
    *   `sort`: Sort options (`newest`, `oldest`, `dueDateAsc`, `dueDateDesc`).
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "603f7f525cf3c94d0c9f1a24",
          "user": "603f7e1b5cf3c94d0c9f1a23",
          "title": "Complete MERN Project",
          "description": "Develop and document the assessment dashboard system",
          "status": "In Progress",
          "priority": "High",
          "dueDate": "2026-05-25T00:00:00.000Z",
          "createdAt": "2026-05-23T11:05:00.000Z",
          "updatedAt": "2026-05-23T11:05:00.000Z"
        }
      ]
    }
    ```

#### 2. Create Task
*   **Route**: `POST /api/tasks`
*   **Access**: Protected (Requires JWT)
*   **Request Body**:
    ```json
    {
      "title": "Document API endpoints",
      "description": "Write markdown details for all route handlers",
      "status": "Pending",
      "priority": "Medium",
      "dueDate": "2026-05-24"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603f7fa45cf3c94d0c9f1a25",
        "user": "603f7e1b5cf3c94d0c9f1a23",
        "title": "Document API endpoints",
        "description": "Write markdown details for all route handlers",
        "status": "Pending",
        "priority": "Medium",
        "dueDate": "2026-05-24T00:00:00.000Z",
        "createdAt": "2026-05-23T11:07:00.000Z",
        "updatedAt": "2026-05-23T11:07:00.000Z"
      }
    }
    ```

#### 3. Update Task
*   **Route**: `PUT /api/tasks/:id`
*   **Access**: Protected (Requires JWT)
*   **Request Body** (Send only fields you wish to update):
    ```json
    {
      "status": "Completed"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603f7fa45cf3c94d0c9f1a25",
        "user": "603f7e1b5cf3c94d0c9f1a23",
        "title": "Document API endpoints",
        "description": "Write markdown details for all route handlers",
        "status": "Completed",
        "priority": "Medium",
        "dueDate": "2026-05-24T00:00:00.000Z",
        "createdAt": "2026-05-23T11:07:00.000Z",
        "updatedAt": "2026-05-23T11:09:00.000Z"
      }
    }
    ```

#### 4. Delete Task
*   **Route**: `DELETE /api/tasks/:id`
*   **Access**: Protected (Requires JWT)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {},
      "message": "Task successfully removed"
    }
    ```

---

## 6. Installation & Execution Guide

### Prerequisites:
1.  **Node.js** (v18+ recommended)
2.  **MongoDB** (Ensure local MongoDB is running at `mongodb://localhost:27017` or use MongoDB Atlas)

### Setup Steps:

1.  **Extract/Clone the project** to your local workspace directory.
2.  **Configure environment variables**:
    *   Create a `.env` file under the `/backend` folder.
    *   Add the following variables (adjust according to your environment):
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/taskmanager
        JWT_SECRET=spacECE_Task_Management_Secret_JWT_Key_2026
        ```
3.  **Install dependencies**:
    *   Open terminal in the root directory and run:
        ```bash
        npm install
        npm run install-all
        ```
        *(This installs root runner packages, backend dependencies, and frontend dependencies automatically).*

4.  **Run in Development Mode**:
    *   In the root directory terminal, execute:
        ```bash
        npm run dev
        ```
        *(This concurrently launches the Node/Express backend server on port `5000` and the Vite React development server on port `3000`)*.
    *   Open your web browser and navigate to: `http://localhost:3000`

---

## 7. Submission Artifacts (Screenshots Guide)
To output the final PDF report for evaluation, please append the following screenshot visuals to this report structure:

1.  **Registration View**: Showcasing full validations, premium inputs, and sleek dark background.
2.  **Login View**: Demonstrating account credentials loading states.
3.  **Empty Dashboard**: Showing custom `FolderHeart` vector container stating "No Tasks Found" and the "Add Your First Task" trigger.
4.  **Create/Edit Modal Overlay**: Showcasing datepicker, status selector options, priority settings, and form overlays.
5.  **Populated Dashboard Grid**: Highlighting active status badges (color-coded), priority tags, overdue items marked red, and live overall progress bar tracking completion percentage.
6.  **Filter/Search Operations**: Screen capturing active text filtering matching titles/descriptions instantly.
