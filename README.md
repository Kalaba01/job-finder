# Job Finder

Job Finder is a comprehensive Human Resources Management System (HRMS) that leverages the Model-View-Controller-Service (MVCS) architecture to streamline recruitment and selection processes for companies while providing an intuitive platform for candidates and administrators. Built using Node.js for the backend, EJS for the frontend, and PostgreSQL as the database, Job Finder delivers a responsive and scalable multi-user platform. The MVCS architecture ensures a clean separation of concerns, promoting modularity, maintainability, and scalability. The application caters to the needs of three primary user roles: Admin, Companies, and Candidates, each with specific functionalities and access levels.

## Project Architecture

```
job-finder/
|-- config/                                   # Configuration files for the application
|   |-- locales/                              # Localization files
|   |   |-- bs.json                           # Bosnian translations
|   |   |-- en.json                           # English translations
|   |-- appConfig.js                          # Application-level configuration
|   |-- database.js                           # Database connection setup
|   |-- i18nConfig.js                         # Internationalization configuration
|   |-- index.js                              # Main configuration index
|   |-- initDatabase.js                       # Database initialization script
|   |-- passport.js                           # Passport.js configuration for authentication
|   |-- routesConfig.js                       # Centralized routes configuration
|   |-- sequelize.js                          # Sequelize ORM configuration
|   |-- sessionConfig.js                      # Session management setup
|   |-- transporterConfig.js                  # Email transporter configuration
|
|-- controllers/                              # Business logic controllers
|   |-- adminController.js                    # Admin-specific logic
|   |-- applicationController.js              # Candidate applications management
|   |-- authController.js                     # Authentication-related actions
|   |-- candidateController.js                # Candidate-specific logic
|   |-- fileController.js                     # File upload and management logic
|   |-- firmController.js                     # Firm-specific logic
|   |-- hiringPhaseController.js              # Logic for managing hiring phases
|   |-- hiringProcessController.js            # Logic for handling hiring processes
|   |-- imageController.js                    # Image upload and handling logic
|   |-- jobAdsController.js                   # Logic for managing job advertisements
|   |-- notificationController.js             # User notification management
|   |-- passwordResetController.js            # Password reset handling
|   |-- ticketController.js                   # Support ticket management
|
|-- middleware/                               # Application middleware
|   |-- authMiddleware.js                     # Authentication-related middleware
|   |-- authValidation.js                     # Validation for authentication inputs
|   |-- firmApplicationAccessMiddleware.js    # Access control for firm applications
|   |-- firmHiringProcessAccessMiddleware.js  # Access control for firm hiring processes
|   |-- index.js                              # Middleware index file
|   |-- languageMiddleware.js                 # Language preference middleware
|   |-- notFoundMiddleware.js                 # Middleware for handling 404 errors
|   |-- setMenuOptions.js                     # Middleware to configure menu options based on roles
|   |-- uploadMiddleware.js                   # Middleware for file uploads
|   |-- userRedirectMiddleware.js             # Redirect middleware for user roles
|
|-- models/                                   # Sequelize ORM models
|   |-- Admin.js                              # Model for admin users
|   |-- Application.js                        # Model for job applications
|   |-- Candidate.js                          # Model for candidates
|   |-- File.js                               # Model for uploaded files
|   |-- Firm.js                               # Model for firms
|   |-- FirmRequest.js                        # Model for firm registration requests
|   |-- HiringPhase.js                        # Model for hiring phases
|   |-- HiringProcess.js                      # Model for hiring processes
|   |-- HiringProcessCandidate.js             # Model for candidates in hiring processes
|   |-- Image.js                              # Model for images
|   |-- InterviewComment.js                   # Model for interview comments
|   |-- InterviewInvite.js                    # Model for interview invitations
|   |-- JobAd.js                              # Model for job advertisements
|   |-- Notification.js                       # Model for notifications
|   |-- PasswordResetToken.js                 # Model for password reset tokens
|   |-- Ticket.js                             # Model for support tickets
|   |-- TicketConversation.js                 # Model for ticket conversations
|   |-- User.js                               # Model for application users
|   |-- index.js                              # Index file for Sequelize models
|
|-- public/                                   # Static assets and files
|   |-- images/                               # Image files
|   |-- js/                                   # Client-side JavaScript files
|   |-- styles/                               # CSS styles
|   |   |-- emails/                           # Styles for email templates
|   |-- index.html                            # Main HTML file
|
|-- routes/                                   # Routes
|   |-- adminRoutes.js                        # Admin-related routes
|   |-- authRoutes.js                         # Authentication routes
|   |-- candidateRoutes.js                    # Candidate-specific routes
|   |-- fileRoutes.js                         # File handling routes
|   |-- firmRoutes.js                         # Firm-specific routes
|   |-- imageRoutes.js                        # Image handling routes
|   |-- languageRoutes.js                     # Language management routes
|   |-- notificationRoutes.js                 # Notification routes
|   |-- passwordResetRoutes.js                # Password reset routes
|   |-- ticketRoutes.js                       # Support ticket routes
|   |-- index.js                              # Main routes index
|
|-- schedulers/                               # Scheduled jobs
|   |-- jobScheduler.js                       # Scheduler for background jobs
|
|-- services/                                 # Business logic services
|   |-- adminService.js                       # Admin-related service logic
|   |-- applicationService.js                 # Application-related service logic
|   |-- authService.js                        # Authentication service
|   |-- candidateService.js                   # Candidate-related service logic
|   |-- dashboardService.js                   # Dashboard-related service logic
|   |-- emailService.js                       # Email sending service
|   |-- fileService.js                        # File handling service logic
|   |-- firmRequestService.js                 # Firm request handling service
|   |-- firmService.js                        # Firm-related service logic
|   |-- hiringPhaseService.js                 # Hiring phase-related service logic
|   |-- hiringProcessService.js               # Hiring process-related service logic
|   |-- hiringProcessCandidateService.js      # Service for candidates in hiring processes
|   |-- imageService.js                       # Image handling service logic
|   |-- interviewCommentService.js            # Service for managing interview comments
|   |-- interviewInviteService.js             # Interview invitation handling service
|   |-- jobAdsService.js                      # Job advertisement service logic
|   |-- notificationService.js                # Notification handling service
|   |-- passwordResetService.js               # Password reset handling service
|   |-- ticketService.js                      # Ticket-related service logic
|   |-- userService.js                        # User-related service logic
|
|-- sockets/                                  # WebSocket handlers
|   |-- applicationSocket.js                  # WebSocket logic for applications
|   |-- hiringProcessSocket.js                # WebSocket logic for hiring processes
|   |-- interviewSocket.js                    # WebSocket logic for interviews
|   |-- notificationSocket.js                 # WebSocket logic for notifications
|   |-- ticketSocket.js                       # WebSocket logic for tickets
|   |-- socketManager.js                      # WebSocket manager
|
|-- views/                                    # EJS templates
|   |-- admin/                                # Admin-related views
|   |-- admin-firm-candidate/                 # Admin views for firm-candidate interactions
|   |-- candidate/                            # Candidate-related views
|   |-- emails/                               # Email templates
|   |-- firm/                                 # Firm-related views
|   |-- firm-candidate/                       # Views for firm-candidate interactions
|   |-- partials/                             # Shared partials (e.g., headers, footers)
|   |-- shared/                               # Shared views (e.g., 404, success pages)
|   |-- index.ejs                             # Main EJS template
|
|-- app.js                                    # Entry point of the application
|-- package.json                              # NPM package dependencies
|-- package-lock.json                         # Lock file for dependencies
|-- README.md                                 # Project documentation
```

## Pre-required Installation

1) Node.js (v16 or higher): https://nodejs.org/en/download
2) PostgreSQL (v13 or higher): https://www.postgresql.org/download/

## Installation Guide

1) Clone the Repository
```
git clone https://github.com/your-repository/job-finder.git
cd job-finder
```
2) Install Dependencies
```
npm install
```
3) Configure Environment Variables

Create a .env file in the root directory and set up the following:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=your_database_port

PORT=your_application_port

SESSION_SECRET=your_session_secret

EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
SMTP_FROM=your_email_from_address
```
4) Run the Server
```
npm start
```
The application will be available at http://localhost:3000

## Features

### Admin:
- Dashboard: View platform statistics (e.g., total users, firms, job ads)
- User Management: Approve or reject firm registrations, delete or suspend users
- Job Management: Moderate job ads and hiring processes
- Support Tickets: Resolve support tickets submitted by firms and candidates

### Firm:
- Profile Management: Update firm details
- Job Ad Management: Create, update, and delete job ads
- Application Review: Review and manage candidate applications
- Hiring Process Management: Define hiring phases and transition candidates through the process
- Interview Scheduling: Set up interviews and notify candidates via email
- Candidate Evaluation: Leave comments and generate reports for candidates
- Notifications: Get notified about candidate activities

### Candidate:
- Profile Management: Update personal details, upload CVs, and other documents
- Job Applications: Search and apply for job ads
- Application Tracking: Monitor the status of job applications
- Interview Management: Accept or reject interview invitations
- Support Tickets: Create tickets for queries or issues

## Libraries and Tools
| Libary/Tool  | Version | Purpose                         |
|--------------|---------|---------------------------------|
| Node.js      | 16+     | Backend runtime                 |
| Express.js   | 4.18.1  | Backend framework               |
| EJS          | 3.1.16  | Templating engine               |
| pg           | 8.13.1  | PostgreSQL databasae driver     |
| Sequelize    | 6.21.1  | ORM for PostgreSQL              |
| dotenv       | 16.4.5  | Environment variable management |
| Passport.js  | 0.5.2   | Authentication                  |
| Nodemailer   | 6.9.0   | Email notifications             |
| bcrypt       | 5.1.1   | Password hashing and security   |
| Socket.IO    | 4.8.1   | Real-time communication         |
| Chart.js     | 4.4.7   | Chart and visualization library |
| Multer       | 1.4.5   | File upload handling            |
| uuid         | 11.0.3  | Generate unique identifiers     |
| node-cron    | 3.0.3   | Task scheduling                 |
| juice        | 11.0.0  | Inline CSS for email styling    |
