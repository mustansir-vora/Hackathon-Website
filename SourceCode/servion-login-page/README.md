# Survey Creation Tool

## Overview
This project is a survey creation tool with modern UI elements and role/user management. It features a sleek and responsive design with dynamic animations, a comprehensive dashboard for managing surveys, and a robust system for user roles and permissions.

## Project Structure
```
servion-login-page
├── public
│   ├── index.html          # Main HTML structure for the application
│   ├── styles
│   │   └── main.css        # CSS styles for the application
│   └── assets
│       └── fonts           # Fonts used in the project
├── src
│   ├── app.js              # Entry point of the application with routing
│   ├── components
│   │   ├── CreateSurvey.js # Component for creating and managing surveys
│   │   ├── Dashboard.js    # Main dashboard component for survey and user management
│   │   ├── UserManagementModal.js # Modal for managing users and roles
│   │   ├── NewLogin.js     # Login component
│   │   ├── PrivateRoute.js # Route protection based on authentication
│   │   ├── BackgroundAnimation.js # UI animation component
│   ├── utils
│   │   ├── animations.js   # Functions for handling animations
│   │   └── storage.js      # Functions for managing local storage
│   └── data
│       └── users.json      # Stores user data in JSON format
├── package.json            # Configuration file for npm
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
└── README.md               # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd SourceCode\servion-login-page
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Run 'npm start' in souce code path (servion-login-page) to host the website over localhost port 3000.

## Features
- Survey creation and management with a flow builder for questions and rules.
- Modern theme with a blue color palette and responsive design.
- Dynamic animations and background effects for enhanced user experience.
- Role-based access control with roles such as Admin, Maker, Checker, and Viewer.
- Dashboard for managing surveys, including status tracking and approval workflows.
- User management modal to add, delete, and manage users with roles.
- Local storage of user data for easy access and management.
- Multi-language support for surveys with selectable and default languages.

### User Management Modal
- Add new users with name, password, and role selection (Admin, Maker, Checker, Viewer).
- View list of users with ID, name, masked password with toggle visibility, and role.
- Edit user passwords inline.
- Delete users from the list.
- Save user data to local storage and download JSON file for persistence.
- Clear instructions for updating the user data file and refreshing the application.

## Future Enhancements
- Integration with backend services for user authentication and survey data storage.
- Additional user roles and permissions management features.
- Enhanced animations and transitions for a better user experience.
- Expanded survey question types and advanced survey flow logic.# Survey Creation Tool

## Code Improvements
- Improved code organization and structure for better readability and maintainability.
- Added comments and documentation for easier understanding of the codebase.
- Implemented best practices for coding standards and security.
- Enhanced user experience with improved animations and transitions.
- Improved performance with optimized code and reduced unnecessary computations.