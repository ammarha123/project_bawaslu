// Function to handle the login form submission
const handleLogin = (event) => {
  event.preventDefault(); // Prevent the form from submitting via the default behavior
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message'); // Get the message div

  // Query to check if the username and password match in the database
  const query = 'SELECT * FROM account WHERE username = ? AND password = ?';

  // Execute the query with the provided username and password
  dbConnection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      messageDiv.innerHTML = '<div class="alert alert-danger">Internal server error</div>';
      return;
    }

    if (results.length === 1) {
      // Successful login
      // After successful authentication, generate a session token
      // After successful authentication, generate a session token
      const sessionToken = generateSessionToken();
      // Store the token and loggedInUsername in localStorage
      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('loggedInUsername', username); // Store the username
      window.location.href = `../home/index.html?username=${encodeURIComponent(username)}`;

    } else {
      // Invalid credentials
      console.error('Login failed');
      messageDiv.innerHTML = '<div class="alert alert-danger">Invalid username or password.</div>';
    }
  });
};
// Function to generate a random session token (not recommended for production)
function generateSessionToken() {
  return Math.random().toString(36).substring(2);
}
// Attach the handleLogin function to the form's submit event
document.getElementById('loginForm').addEventListener('submit', handleLogin);
