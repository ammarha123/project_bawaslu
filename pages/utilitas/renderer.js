document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => {
    e.addEventListener('change', function() {
        if (this.value === "rubahPassword") {
            rubahPassword.style.display = "block";
        } else {
            rubahPassword.style.display = "none";
        }
    });
});

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
  } else {
    // User is not logged in, handle accordingly (e.g., redirect to login)
    window.location.href = '../login/index.html';
  }  
  