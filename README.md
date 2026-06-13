# SmartHostel

SmartHostel is a comprehensive, modern hostel management system featuring dedicated interfaces for both hostel owners and students. Built with a scalable architecture, it streamlines administrative tasks, handles student complaints and payments, manages room allocations, and provides a seamless user experience.

## Features

### For Hostel Owners
- **Dashboard Overview**: Get a high-level summary of total students, rooms, active complaints, and revenue.
- **Room Management**: Add, update, or remove rooms. View real-time availability and manage capacities.
- **Student Management**: Easily onboard students, assign rooms, and maintain detailed profiles.
- **Complaint Resolution**: Track, manage, and resolve student complaints with a clear history of actions.
- **Notices**: Publish important announcements and notices directly to student dashboards.
- **Payments Processing**: Keep track of rent payments and financial logs securely.

### For Students
- **Student Dashboard**: A personal hub to view room details, upcoming payments, and active notices.
- **My Complaints**: Submit issues seamlessly and track resolution status in real time.
- **Payment History**: Check past payment records and pending dues.
- **Profile Management**: Update personal contact information and preferences.

## Tech Stack

### Frontend
- **React.js**: Powered by Vite for fast, modern web development.
- **Tailwind CSS**: For responsive, modern, and clean UI components.
- **Redux Toolkit**: Efficient global state management.
- **React Router**: For seamless single-page application routing.
- **Axios**: For making reliable API requests.

### Backend
- **Node.js & Express.js**: Fast, minimalist web framework for building the API.
- **MongoDB**: NoSQL database for flexible data modeling (using Mongoose).
- **JWT (JSON Web Tokens)**: Secure authentication and role-based access control.
- **Bcrypt**: Password hashing for secure user credential storage.
- **Nodemailer**: Automated email notifications and updates.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pullayithrisha/SmartHostel.git
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on the configuration needs (e.g., `MONGO_URI`, `JWT_SECRET`, email credentials).
   Start the server: `npm start`

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory with the required environment variables (e.g., API base URL).
   Start the client: `npm run dev`

## Contribution
Feel free to submit pull requests or raise issues to help improve the SmartHostel platform.
