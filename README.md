# WebWriters Blog Application

WebWriters is a responsive full-stack blog application developed as part of the Codomax Full Stack Web Development Internship.

The application allows users to register, log in securely, create blog posts, read posts, and manage their own content through a personal dashboard.

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas

### Tools
- Visual Studio Code
- Postman
- Git and GitHub

## Features

- Responsive home page with featured blog posts
- User registration and login
- JWT-based authentication
- Protected user dashboard
- Create new blog posts
- View all published blog posts
- Read individual blog posts
- Edit and delete personal blog posts
- User-specific blog management
- Category filtering
- Logout functionality
- Responsive design for desktop, tablet, and mobile
- MongoDB database integration

## Project Structure

```text
blog-application/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── script.js
├── style.css
├── webwriters-icon.png
├── README.md
│
└── Backend/
    ├── server.js
    ├── package.json
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── blogController.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── blogRoutes.js
    └── middleware/
        └── authMiddleware.js
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jagadeshmurugan/blog-application.git
```

### 2. Open the Project

Open the project folder in Visual Studio Code.

### 3. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the Backend folder.

Add the following configuration:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secure_secret_key
```

Replace the placeholder values with your own configuration.

### 5. Start the Backend Server

```bash
node server.js
```

The backend server runs on the configured port.

### 6. Run the Frontend

Open the project folder in Visual Studio Code.

Use the Live Server extension to open `index.html`.

The frontend communicates with the backend REST API.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |

### Blog Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Get all blog posts |
| GET | `/api/blogs/my` | Get logged-in user's posts |
| GET | `/api/blogs/:id` | Get a specific blog post |
| POST | `/api/blogs` | Create a blog post |
| PUT | `/api/blogs/:id` | Update a blog post |
| DELETE | `/api/blogs/:id` | Delete a blog post |

Protected endpoints require a valid JWT token.

## How to Use

1. Open the WebWriters application.
2. Register a new account.
3. Log in using your registered credentials.
4. Open the dashboard.
5. Create and publish blog posts.
6. View, edit, or delete your own posts.
7. Browse published blog posts.
8. Log out when finished.

## Security

- JWT authentication is used to protect user-specific routes.
- Passwords are hashed using bcryptjs.
- Environment variables are stored in a `.env` file.
- Sensitive environment files are excluded from Git using `.gitignore`.

## Future Improvements

- Deploy the application online.
- Add additional blog management features.
- Improve search and filtering functionality.
- Enhance application performance and user experience.

## Author

**Jagadesh M**

Full Stack Web Development Intern

## License

This project was developed for educational and internship purposes.
```

### Next Step

Bro, README save pannitu sollunga.

Adhukku appuram GitHub-la update push pannuvom. Then namma Module 6-oda final task — **Deployment** — start pannalaam! 🚀