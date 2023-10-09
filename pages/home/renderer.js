// Function to get the session token from localStorage
function getSessionToken() {
  return localStorage.getItem('sessionToken');
}

// Function to get the loggedInUsername from localStorage
function getLoggedInUsername() {
  return localStorage.getItem('loggedInUsername');
}

// Check if the user is logged in by verifying the session token
const sessionToken = getSessionToken();
const loggedInUsername = getLoggedInUsername(); // Retrieve the username

if (sessionToken && loggedInUsername) {
  // User is logged in
  const loggedInDiv = document.querySelector('.logged-in');
  loggedInDiv.textContent = `Logged in as: ${loggedInUsername}`;

  // Display the session token in the session-token div
  const sessionTokenDiv = document.querySelector('.session-token');
  const sessionTokenValue = document.getElementById('sessionTokenValue');
  sessionTokenValue.textContent = sessionToken;
  sessionTokenDiv.style.display = 'block'; // Show the session token div
} else {
  // User is not logged in, handle accordingly (e.g., redirect to login)
  window.location.href = '../login/index.html';
}
