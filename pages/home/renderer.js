// Function to get the value of a query parameter from the URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  // Check if a username query parameter exists in the URL
  const loggedInUsername = getQueryParam('username');
  const loggedInDiv = document.querySelector('.logged-in'); // Get the "Logged in as" div
  
  if (loggedInUsername) {
    loggedInDiv.textContent = `Logged in as: ${loggedInUsername}`;
  } else {
    // Username not found in the URL, handle as needed (e.g., display "Not logged in")
  }
  