const USERS_KEY = "blogUsers";
const POSTS_KEY = "blogPosts";
const SESSION_KEY = "blogCurrentUser";

const API_URL = "http://localhost:5000/api";

const samplePosts = [
  {
    id: "sample-1",
    title: "Getting started with the DOM",
    category: "Technology",
    imageUrl: "",
    content: "The DOM is how JavaScript sees your web page. Every tag becomes an object you can read and change.\n\nStart small: select an element with document.querySelector, change its text, then add a click listener. Once that feels natural, forms and dynamic lists become much easier to build.",
    authorId: "sample",
    authorName: "Codomax Team",
    date: "2026-09-02"
  },
  {
    id: "sample-2",
    title: "How to study without burning out",
    category: "Education",
    imageUrl: "",
    content: "Short, focused sessions beat long late-night marathons. Study for 40 minutes, take a 10 minute break, and stop when you are tired instead of pushing through.\n\nWrite down what you learned at the end of each session. If you cannot explain it simply, you probably need another pass.",
    authorId: "sample",
    authorName: "Codomax Team",
    date: "2026-09-10"
  },
  {
    id: "sample-3",
    title: "A weekend in Pondicherry",
    category: "Travel",
    imageUrl: "",
    content: "Rent a bicycle and ride through the French Quarter early in the morning before the heat arrives. The streets are quiet and the colours are at their best.\n\nEnd the day on the promenade by the sea, and try the local filter coffee before you leave.",
    authorId: "sample",
    authorName: "Codomax Team",
    date: "2026-09-18"
  },
  {
    id: "sample-4",
    title: "Small habits that make a big difference",
    category: "Lifestyle",
    imageUrl: "",
    content: "Drink a glass of water when you wake up, walk for ten minutes after lunch and put your phone away an hour before bed.\n\nNone of these take much effort, but after a few weeks you will notice better focus and more energy.",
    authorId: "sample",
    authorName: "Codomax Team",
    date: "2026-09-25"
  }
];

/* Local Storage Functions */

function readData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (error) {
    return null;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function seedPosts() {
  if (localStorage.getItem(POSTS_KEY) === null) {
    saveData(POSTS_KEY, samplePosts);
  }
}

/* Navigation */

function buildNav() {
  const nav = document.getElementById("nav-links");

  if (!nav) return;

  const user = getCurrentUser();
  const page = document.body.dataset.page;

  const links = user
    ? [
        ["index.html", "Home", "home"],
        ["dashboard.html", "Dashboard", "dashboard"],
        ["create-blog.html", "Create Blog", "create"]
      ]
    : [
        ["index.html", "Home", "home"],
        ["login.html", "Login", "login"],
        ["register.html", "Register", "register"]
      ];

  nav.innerHTML = links.map(function (link) {
    const active = link[2] === page
      ? ' class="active" aria-current="page"'
      : "";

    return '<a href="' + link[0] + '"' + active + '>' +
      link[1] + '</a>';
  }).join("");

  if (user) {
    nav.innerHTML +=
      '<button type="button" id="logout-btn" class="btn btn-outline btn-small">Log out</button>';

    document.getElementById("logout-btn")
      .addEventListener("click", logout);
  }

  const toggle = document.getElementById("menu-toggle");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

/* Form Helpers */

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + "-error");

  if (input && error) {
    error.textContent = message;
    input.parentElement.classList.toggle("has-error", message !== "");
  }
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach(function (error) {
    error.textContent = "";
    error.parentElement.classList.remove("has-error");
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Register API */

function setupRegister() {
  const form = document.getElementById("register-form");

  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(form);

    const name = document.getElementById("name").value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword =
      document.getElementById("confirm-password").value;

    let valid = true;

    if (name.length < 2) {
      showError("name", "Please enter your full name.");
      valid = false;
    }

    if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 6) {
      showError("password", "Password must be at least 6 characters.");
      valid = false;
    }

    if (confirmPassword !== password) {
      showError("confirm-password", "Passwords do not match.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Registration failed.";

        if (response.status === 409) {
          showError("email", message);
        } else {
          alert(message);
        }

        return;
      }

      alert("Registration successful!");
      window.location.href = "login.html?registered=true";

    } catch (error) {
      alert("Unable to connect to the server. Please try again.");
      console.error("Registration error:", error);
    }
  });
}

/* Login API */

function setupLogin() {
  const form = document.getElementById("login-form");
  const message = document.getElementById("form-message");

  if (!form || !message) return;

  if (new URLSearchParams(window.location.search).get("registered")) {
    message.textContent = "Account created. You can log in now.";
    message.className = "message message-success";
    message.hidden = false;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(form);

    message.hidden = true;

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    let valid = true;

    if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (password === "") {
      showError("password", "Please enter your password.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Login failed.";
        message.className = "message message-error";
        message.hidden = false;
        return;
      }

      if (!data.user) {
        message.textContent = "User details are missing from server response.";
        message.className = "message message-error";
        message.hidden = false;
        return;
      }

      saveData(SESSION_KEY, data.user);

      window.location.href = "dashboard.html";

    } catch (error) {
      message.textContent = "Unable to connect to the server. Please try again.";
      message.className = "message message-error";
      message.hidden = false;

      console.error("Login error:", error);
    }
  });
}

/* Post Cards */

function createCard(post, showActions) {
  const image = post.imageUrl
    ? '<img src="' + escapeHtml(post.imageUrl) +
      '" alt="" onerror="this.remove()">'
    : "";

  const excerpt = post.content.length > 110
    ? post.content.slice(0, 110).trim() + "..."
    : post.content;

  let actions =
    '<button type="button" class="btn btn-small read-btn" data-id="' +
    escapeHtml(post.id) + '">Read</button>';

  if (showActions) {
    actions +=
      '<a href="create-blog.html?id=' + encodeURIComponent(post.id) +
      '" class="btn btn-outline btn-small">Edit</a>' +
      '<button type="button" class="btn btn-danger btn-small delete-btn" data-id="' +
      escapeHtml(post.id) + '">Delete</button>';
  }

  return (
    '<article class="post-card">' +
      image +
      '<div class="post-body">' +
        '<span class="tag">' + escapeHtml(post.category) + '</span>' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        '<p class="post-meta">By ' + escapeHtml(post.authorName) +
        ' on ' + formatDate(post.date) + '</p>' +
        '<p class="post-excerpt">' + escapeHtml(excerpt) + '</p>' +
        '<div class="post-actions">' + actions + '</div>' +
      '</div>' +
    '</article>'
  );
}

function openPost(id) {
  const post = readData(POSTS_KEY).find(function (item) {
    return item.id === id;
  });

  const dialog = document.getElementById("post-dialog");

  if (!post || !dialog) return;

  const image = post.imageUrl
    ? '<img src="' + escapeHtml(post.imageUrl) +
      '" alt="" onerror="this.remove()">'
    : "";

  dialog.innerHTML =
    image +
    '<span class="tag">' + escapeHtml(post.category) + '</span>' +
    '<h2>' + escapeHtml(post.title) + '</h2>' +
    '<p class="post-meta">By ' + escapeHtml(post.authorName) +
    ' on ' + formatDate(post.date) + '</p>' +
    '<p class="post-full-text">' + escapeHtml(post.content) + '</p>' +
    '<button type="button" class="btn btn-outline btn-small" id="close-dialog">Close</button>';

  dialog.showModal();

  document.getElementById("close-dialog")
    .addEventListener("click", function () {
      dialog.close();
    });
}

function setupReadButtons(container) {
  container.addEventListener("click", function (event) {
    const button = event.target.closest(".read-btn");

    if (button) {
      openPost(button.dataset.id);
    }
  });
}

/* Home Page */

function setupHome() {
  const featured = document.getElementById("featured-posts");
  const list = document.getElementById("post-list");
  const filter = document.getElementById("category-filter");

  if (!featured || !list || !filter) return;

  const posts = readData(POSTS_KEY);

  function showAllPosts() {
    const category = filter.value;

    const shown = category === "All"
      ? posts
      : posts.filter(function (post) {
          return post.category === category;
        });

    if (shown.length === 0) {
      list.innerHTML =
        '<div class="empty-message">No posts in this category yet.</div>';
      return;
    }

    list.innerHTML = shown.map(function (post) {
      return createCard(post, false);
    }).join("");
  }

  if (posts.length === 0) {
    featured.innerHTML =
      '<div class="empty-message">No posts have been published yet.<br>' +
      '<a href="create-blog.html" class="btn">Write the first one</a></div>';
  } else {
    featured.innerHTML = posts.slice(0, 3).map(function (post) {
      return createCard(post, false);
    }).join("");
  }

  showAllPosts();

  filter.addEventListener("change", showAllPosts);

  setupReadButtons(featured);
  setupReadButtons(list);
}

/* Dashboard */

function setupDashboard() {
  const user = getCurrentUser();
  const container = document.getElementById("my-posts");

  if (!user || !container) return;

  document.getElementById("welcome-title").textContent =
    "Welcome, " + user.name.split(" ")[0];

  function showMyPosts() {
    const myPosts = readData(POSTS_KEY).filter(function (post) {
      return String(post.authorId) === String(user.id);
    });

    document.getElementById("post-summary").textContent =
      myPosts.length === 1
        ? "You have published 1 post."
        : "You have published " + myPosts.length + " posts.";

    if (myPosts.length === 0) {
      container.innerHTML =
        '<div class="empty-message">You have not published anything yet.<br>' +
        '<a href="create-blog.html" class="btn">Write your first post</a></div>';
      return;
    }

    container.innerHTML = myPosts.map(function (post) {
      return createCard(post, true);
    }).join("");
  }

  container.addEventListener("click", function (event) {
    const button = event.target.closest(".delete-btn");

    if (!button) return;

    if (confirm("Delete this post? This cannot be undone.")) {
      const remaining = readData(POSTS_KEY).filter(function (post) {
        return String(post.id) !== String(button.dataset.id);
      });

      saveData(POSTS_KEY, remaining);
      showMyPosts();
    }
  });

  setupReadButtons(container);
  showMyPosts();
}

/* Create and Edit Blog */

function setupCreateBlog() {
  const user = getCurrentUser();
  const form = document.getElementById("blog-form");

  if (!user || !form) return;

  const editId = new URLSearchParams(window.location.search).get("id");
  let editingPost = null;

  if (editId) {
    editingPost = readData(POSTS_KEY).find(function (post) {
      return String(post.id) === String(editId) &&
       String(post.authorId) === String(user.id);
    });

    if (!editingPost) {
      window.location.href = "dashboard.html";
      return;
    }

    document.title = "Inkwell Blog - Edit Blog";
    document.getElementById("form-title").textContent = "Edit your post";
    document.getElementById("submit-btn").textContent = "Save changes";

    document.getElementById("title").value = editingPost.title;
    form.category.value = editingPost.category;
    form.image.value = editingPost.imageUrl;
    form.content.value = editingPost.content;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(form);

    const title = document.getElementById("title").value.trim();
    const category = form.category.value;
    const imageUrl = form.image.value.trim();
    const content = form.content.value.trim();

    let valid = true;

    if (title.length < 5) {
      showError("title", "The title should be at least 5 characters.");
      valid = false;
    }

    if (category === "") {
      showError("category", "Please choose a category.");
      valid = false;
    }

    if (imageUrl !== "" && !/^https?:\/\/\S+$/i.test(imageUrl)) {
      showError("image", "Enter a full link starting with http:// or https://");
      valid = false;
    }

    if (content.length < 50) {
      showError("content", "The content should be at least 50 characters.");
      valid = false;
    }

    if (!valid) return;

    const posts = readData(POSTS_KEY);

    /* Edit Existing Blog - Local Storage */

    if (editingPost) {
      editingPost.title = title;
      editingPost.category = category;
      editingPost.imageUrl = imageUrl;
      editingPost.content = content;

      saveData(POSTS_KEY, posts.map(function (post) {
       return String(post.id) === String(editingPost.id)
       ? editingPost
       : post;
      }));

      window.location.href = "dashboard.html";
      return;
    }

    /* Create New Blog - Backend API */

    const submitButton = document.getElementById("submit-btn");
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Publishing...";

    try {
      const response = await fetch(API_URL + "/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          category: category,
          imageUrl: imageUrl,
          content: content,
          authorId: user.id,
          authorName: user.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create blog.");
      }

      /*
        Supports common backend response formats:
        { blog: {...} }
        { post: {...} }
        { data: {...} }
        or direct blog object.
      */

      const createdBlog =
        data.blog ||
        data.post ||
        data.data ||
        data;

      const newPost = {
        id: createdBlog.id || createdBlog._id || ("post-" + Date.now()),
        title: createdBlog.title || title,
        category: createdBlog.category || category,
        imageUrl: createdBlog.imageUrl || imageUrl,
        content: createdBlog.content || content,
        authorId: createdBlog.authorId || user.id,
        authorName: createdBlog.authorName || user.name,
        date: createdBlog.date || createdBlog.createdAt ||
          new Date().toISOString().slice(0, 10)
      };

      /* Save API response in Local Storage for existing UI */

      const updatedPosts = readData(POSTS_KEY);

      updatedPosts.unshift(newPost);

      saveData(POSTS_KEY, updatedPosts);

      alert("Blog published successfully!");

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Create Blog API Error:", error);

      alert(error.message || "Unable to connect to the server. Please try again.");

      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* Start Application */

seedPosts();
buildNav();

const currentPage = document.body.dataset.page;
const loggedIn = getCurrentUser() !== null;

if (
  (currentPage === "dashboard" || currentPage === "create") &&
  !loggedIn
) {
  window.location.href = "login.html";

} else if (
  (currentPage === "login" || currentPage === "register") &&
  loggedIn
) {
  window.location.href = "dashboard.html";

} else if (currentPage === "home") {
  setupHome();

} else if (currentPage === "login") {
  setupLogin();

} else if (currentPage === "register") {
  setupRegister();

} else if (currentPage === "dashboard") {
  setupDashboard();

} else if (currentPage === "create") {
  setupCreateBlog();
}