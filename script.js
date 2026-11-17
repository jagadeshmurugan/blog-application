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
  localStorage.removeItem("blogToken");
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
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    let valid = true;

    if (name.length < 2) {
      showError("name", "Name must be at least 2 characters.");
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

    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match.");
      valid = false;
    }

    if (!valid) return;

    const submitButton = document.getElementById("submit-btn");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Registering...";
    }

    try {
      const response = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      alert("Account created successfully!");
      window.location.href = "login.html?registered=true";

    } catch (error) {
      console.error("Register API Error:", error);
      alert(error.message || "Unable to connect to the server.");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Register";
      }
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
      if (!data.token) {
        message.textContent = "Authentication token is missing.";
        message.className = "message message-error";
        message.hidden = false;
        return;
      }
      localStorage.setItem("blogToken", data.token);
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

  let actions = '<a href="blog-details.html?id=' + encodeURIComponent(post.id) + '" class="btn btn-small">Read</a>';

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

/* Home Page */

async function setupHome() {
  const featured = document.getElementById("featured-posts");
  const list = document.getElementById("post-list");
  const filter = document.getElementById("category-filter");
  const search = document.getElementById("blog-search");


  if (!featured || !list || !filter || !search) return;

  let posts = [];

  function showAllPosts() {
    const category = filter.value;
    const searchText = search.value.trim().toLowerCase();

    const shown = posts.filter(function (post) {
      const matchesCategory =
        category === "All" || post.category === category;

      const matchesSearch =
        String(post.title || "").toLowerCase().includes(searchText) ||
        String(post.content || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    if (shown.length === 0) {
      list.innerHTML =
        '<div class="empty-message">No matching blogs found.</div>';
      return;
    }

    list.innerHTML = shown.map(function (post) {
      return createCard(post, false);
    }).join("");
  }

  try {
    featured.innerHTML =
      '<div class="empty-message">Loading blogs...</div>';

    const response = await fetch(API_URL + "/blogs");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load blogs.");
    }

    posts = (data.blogs || []).map(function (post) {
      return {
        ...post,
        date: post.date || post.createdAt
      };
    });

    if (posts.length === 0) {
      featured.innerHTML =
        '<div class="empty-message">No posts have been published yet.</div>';
    } else {
      featured.innerHTML = posts.slice(0, 3).map(function (post) {
        return createCard(post, false);
      }).join("");
    }

    showAllPosts();

    filter.addEventListener("change", showAllPosts);
    search.addEventListener("input", showAllPosts);


  } catch (error) {
    console.error("Get Blogs API Error:", error);

    featured.innerHTML =
      '<div class="empty-message">Unable to load blogs. Please try again.</div>';

    list.innerHTML = "";
  }
}


/* Dashboard */

async function setupDashboard() {
  const user = getCurrentUser();
  const token = localStorage.getItem("blogToken");
  const container = document.getElementById("my-posts");

  if (!user || !token) {
    window.location.href = "login.html";
    return;
  }

  if (!container) return;

  document.getElementById("welcome-title").textContent =
    "Welcome, " + user.name.split(" ")[0];
  document.getElementById("welcome-email").textContent = user.email;

  async function showMyPosts() {
    try {
      const response = await fetch(API_URL + "/blogs/my", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load blogs.");
      }

      const myPosts = data.blogs || [];

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
        return createCard({
          ...post,
          date: post.date || post.createdAt
        }, true);
      }).join("");

    } catch (error) {
      console.error("Dashboard API Error:", error);
      container.innerHTML =
        '<div class="empty-message">Unable to load your blogs.</div>';
    }
  }

  container.addEventListener("click", async function (event) {
    const button = event.target.closest(".delete-btn");

    if (!button) return;

    if (!confirm("Delete this post? This cannot be undone.")) return;

    button.disabled = true;

    try {
      const response = await fetch(
        API_URL + "/blogs/" + encodeURIComponent(button.dataset.id),
        {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete blog.");
      }

      alert("Blog deleted successfully!");
      await showMyPosts();

    } catch (error) {
      alert(error.message);
      button.disabled = false;
    }
  });

  await showMyPosts();
}

/* Create and Edit Blog */
async function setupCreateBlog() {
    const user = getCurrentUser();
    const token = localStorage.getItem("blogToken");
    const form = document.getElementById("blog-form");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get("id");
    let editingPost = null;

    if (editId) {
        try {
            const response = await fetch(
                API_URL + "/blogs/" + encodeURIComponent(editId)
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load blog.");
            }

            editingPost = data.blog;

            if (String(editingPost.authorId) !== String(user.id)) {
                alert("You cannot edit this blog.");
                window.location.href = "dashboard.html";
                return;
            }

            document.title = "Inkwell Blog - Edit Blog";
            document.getElementById("form-title").textContent = "Edit your post";
            document.getElementById("submit-btn").textContent = "Save changes";

            document.getElementById("title").value = editingPost.title;
            form.category.value = editingPost.category;
            form.image.value = editingPost.imageUrl || "";
            form.content.value = editingPost.content;

        } catch (error) {
            alert(error.message);
            window.location.href = "dashboard.html";
            return;
        }
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

        const submitButton = document.getElementById("submit-btn");
        const originalButtonText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = editingPost ? "Saving..." : "Publishing...";

        try {
            const response = await fetch(
                editingPost
                    ? API_URL + "/blogs/" + encodeURIComponent(editId)
                    : API_URL + "/blogs",
                {
                    method: editingPost ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        imageUrl,
                        content
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save blog.");
            }

            alert(editingPost ? "Blog updated successfully!" : "Blog published successfully!");
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Blog API Error:", error);
            alert(error.message || "Unable to connect to the server.");

            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
async function setupBlogDetails() {
  const container = document.getElementById("blog-details");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    container.innerHTML = '<p class="empty-message">Blog not found.</p>';
    return;
  }

  try {
    const response = await fetch(
      API_URL + "/blogs/" + encodeURIComponent(blogId)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load blog.");
    }

    const post = data.blog;

    const image = post.imageUrl
      ? `<img src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.title)}">`
      : "";

    container.innerHTML = `
              <article class="blog-details">
                  ${image}
                  <p>${escapeHtml(post.category)}</p>
                  <h1>${escapeHtml(post.title)}</h1>
                  <p>By ${escapeHtml(post.authorName)}</p>
                  <p>${formatDate(post.date || post.createdAt)}</p>
                  <div>${escapeHtml(post.content)}</div>
                  <a href="index.html" class="btn">Back to Home</a>
              </article>
          `;

  } catch (error) {
    console.error("Blog Details Error:", error);
    container.innerHTML =
      '<p class="empty-message">Unable to load blog details.</p>';
  }
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
} else if (currentPage === "blog-details") {
  setupBlogDetails();
}
