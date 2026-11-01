# Inkwell Blog Application

A small, responsive blog application built for the Codomax Full Stack Web Development internship (Module 01). Users can register, log in, publish blog posts, and manage their own posts from a dashboard.

## Technologies Used

- HTML5
- CSS3 (Flexbox and Grid)
- Vanilla JavaScript
- Browser localStorage

No frameworks or libraries are used.

## Features

- Home page with a hero section, featured posts, and a post list with a category filter
- Registration with input validation
- Login that checks accounts created through the registration form
- Dashboard showing the logged-in user's own posts
- Create, edit, and delete blog posts (title, category, optional image URL, content)
- Read any post in a pop-up window
- Friendly messages when there are no posts
- Logout
- Responsive layout for desktop, tablet, and mobile

## Folder Structure

```
blog-application/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run in VS Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the `blog-application` folder with **File > Open Folder**.
3. Install the **Live Server** extension from the Extensions panel.
4. Right-click `index.html` and choose **Open with Live Server**.
5. The app opens in your browser, usually at `http://127.0.0.1:5500/`.

You can also open `index.html` directly in a browser, but Live Server is recommended.

## How to Use

1. Click **Register** and create an account.
2. Log in with the same email and password.
3. Open **Create Blog** and publish a post.
4. Go to the **Dashboard** to view, edit, or delete your posts.
5. Click **Log out** when you are done.

## Limitations

- **Authentication uses localStorage for demonstration only. It is not secure and must not be used in production.** Passwords are stored as plain text in the browser, and anyone with access to the browser can read them.
- All data stays in one browser. It is not shared between devices or users.
- Clearing browser data removes all accounts and posts.
- Images are loaded from external URLs, so they depend on those links staying available.
- There is no backend, password recovery, or email verification.
