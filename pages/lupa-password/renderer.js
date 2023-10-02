// Function to handle the password reset request
const handlePasswordReset = (event) => {
    event.preventDefault(); // Prevent the form from submitting via the default behavior
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('password').value;
    const rePassword = document.getElementById('re-password').value;
    const messageDiv = document.getElementById('message'); // Get the message div
  
    // Clear any previous messages
    messageDiv.innerHTML = '';

    function clearinput(){
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('re-password').value = '';
    }
  
    if (newPassword !== rePassword) {
      // Passwords do not match
      messageDiv.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
      clearinput()
      return;
    }
  
    // Query to update the password in the database
    const query = 'UPDATE account SET password = ? WHERE username = ?';
  
    // Execute the query to update the password
    dbConnection.query(query, [newPassword, username], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        messageDiv.innerHTML = '<div class="alert alert-danger">Internal server error</div>';
        return;
      }
  
      if (results.affectedRows === 1) {
        // Password reset successful
        messageDiv.innerHTML = '<div class="alert alert-success">Password reset successful. You can now log in with your new password.</div>';
        
        // Clear input fields
        clearinput()
      } else {
        // Username not found
        messageDiv.innerHTML = '<div class="alert alert-danger">Username not found. Please check your username.</div>';
        clearinput()
      }
    });
  };
  
  // Attach the handlePasswordReset function to the form's submit event
  document.getElementById('resetPasswordForm').addEventListener('submit', handlePasswordReset);
  