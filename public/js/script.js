console.log("script is ready");
const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = $("#email-login").val().trim();
  const password = $("#password-login").val().trim();
  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
    return;
  }
  console.log("fill in the requiered form");
  return;
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const userName = $("#name-signup").val().trim();
  const email = $("#email-signup").val().trim();
  const password = $("#password-signup").val().trim();
  const password2 = $("#password-signup2").val().trim();
  if (password !== password2) {
    alert("passwords should match!");
    return;
  }
  if (userName && email && password && password2) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ userName, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert(response.statusText);
    }
  }
};

const addNewPost = async (event) => {
  const title = $("#post-title").val().trim();
  const content = $("#post-content").val().trim();
  const id = parseInt($("#post-id").text().trim());
  event.preventDefault();
  if (title && content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      alert(response.statusText);
    }
  }
};
const updatePost = async (event) => {
  const title = $("#post-title").val().trim();
  const content = $("#post-content").val().trim();
  const id = parseInt($("#post-id").text().trim());
  event.preventDefault();
  if (title && content) {
    // Send a POST request to the API endpoint
    const response = await fetch(`/api/post/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      alert(response.statusText);
    }
  }
};
const deletePost = async (event) => {
  const id = parseInt($("#post-id").text().trim());

  event.preventDefault();
  const response = await fetch(`/api/post/${id}`, { method: "DELETE" });

  if (response.ok) {
    // If successful, redirect the browser to the profile page
    document.location.replace("/profile");
  } else {
    alert(response.statusText);
  }
};
const logout = async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert(response.statusText);
  }
};

const addComment = async (event) => {
  const post_id = parseInt($("#post-id").text().trim());
  const user_id = parseInt($("#post-id").text().trim());
  const content = $("#comment-content").val().trim();
  console.log(post_id, user_id, content);
  event.preventDefault();
  if (content) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ post_id, user_id, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
  }
};

$(".login-form").on("submit", loginFormHandler);

$(".signup-form").on("submit", signupFormHandler);
$("#addNewPost").on("click", addNewPost);
$("#updatePost").on("click", updatePost);
$("#deletePost").on("click", deletePost);
$("#addComment").on("click", addComment);

$("#logout").on("click", logout);
