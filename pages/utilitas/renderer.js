const { create } = require('domain');
const dbConnection = require('../../database'); // Adjust the path based on your project structure

// Assuming you have the xlsx library already imported in your code
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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

// Handle the radio button change event
document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => {
  e.addEventListener('change', function() {
    if (this.value === "rubahPassword") {
      rubahPassword.style.display = "block";
    } else {
      rubahPassword.style.display = "none";
    }
  });
});

// Function to check user role and update UI accordingly
function checkUserRole() {
  // Check if the user is logged in
  if (sessionToken && loggedInUsername) {
      // User is logged in
      const loggedInDiv = document.querySelector('.logged-in');
      loggedInDiv.textContent = `Logged in as: ${loggedInUsername}`;

      const SuperAdminOptions = document.getElementById('SuperAdminOptions');
const adminOptions = document.getElementById('adminOptions');

if (loggedInUsername === "super-admin") {
    // Display the SuperAdminOptions block without !important
    SuperAdminOptions.style.display = 'block';
    adminOptions.style.display = 'block';
} else {
    // Display the SuperAdminOptions block with !important
    SuperAdminOptions.classList.add('hide-important');
    adminOptions.style.display = 'block';
}

  } else {
      // User is not logged in, handle accordingly (e.g., redirect to login)
      window.location.href = '../login/index.html';
  }
}

// Call the function initially
checkUserRole();

// Function to retrieve displayed data from session storage
function getDisplayDataFromSessionStorage() {
  const dataJSON = sessionStorage.getItem('displayedData');
  if (dataJSON) {
    // Log to the console when data is retrieved
    const retrievedData = JSON.parse(dataJSON);
    console.log('Data retrieved from session storage in Utilitas:', retrievedData);
    return retrievedData;
  }
  return null;
}

// Call the function to retrieve displayed data from session storage
const displayedData = getDisplayDataFromSessionStorage();
if (displayedData) {
  // You can now use the retrieved data in Utilitas
  console.log('Data is available in Utilitas:', displayedData);
  // Perform any necessary actions with the retrieved data
} else {
  console.log('No data found in session storage in Utilitas');
}

// Define the header row for your Excel file
const headerRow = [
  'No.',
  'Nama',
  'Jenis Kelamin',
  'Usia',
  'Kecamatan',
  'Kelurahan',
  'RT',
  'RW',
  'TPS'
];
document.getElementById('backUpRadio').addEventListener('change', async () => {
   // Call the function after clicking the backup button
   checkUserRole();

  const messageDiv = document.getElementById('message4'); // Get the message div
  messageDiv.innerHTML = ''; // Clear previous messages

  if (document.getElementById('backUpRadio').checked) {
      if (displayedData) {
          // Create a new workbook and add a worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Edited Data');

          // Create an array that represents the order of columns
          const columnOrder = ['No.', 'Nama', 'Jenis Kelamin', 'Usia',, 'Kecamatan', 'Kelurahan', 'RT', 'RW', 'TPS'];

          // Add the header row to the worksheet in the specified order
          worksheet.addRow(columnOrder);

          // Add the data rows to the worksheet
          for (let i = 0; i < displayedData.length; i++) {
              const item = displayedData[i];
              const row = [i + 1, ...columnOrder.slice(1).map((key) => item[key] ? item[key].toString() : '')];
              worksheet.addRow(row);
          }

          // Create unique filenames for the Excel files
          const now = Date.now();
          const editedFileName = `edited_data_${now}.xlsx`;

          // Specify the path where the Excel file will be saved
          const editedDataPath = path.join(__dirname, '../../backup', editedFileName);

          // Check if the backup folder exists, and create it if not
          const backupFolderPath = path.join(__dirname, '../../backup');
          if (!fs.existsSync(backupFolderPath)) {
              fs.mkdirSync(backupFolderPath);
          }

          try {
              // Save the workbook to a file
              await workbook.xlsx.writeFile(editedDataPath);

              console.log(`Backup Excel file saved to: ${editedDataPath}`);
              messageDiv.innerHTML = '<div class="alert alert-success">Data backup to Excel Successfully</div>';
          } catch (error) {
              console.error('Error saving backup data to Excel:', error);
              messageDiv.textContent = 'Error saving backup data to Excel. Please try again.';
          }
      } else {
          console.log('No displayed data available for backup.');
          messageDiv.textContent = 'No displayed data available for backup.';
      }
  }
});

// Function to handle the password change request
const changePassword = (event) => {
  event.preventDefault(); // Prevent the form from submitting via the default behavior
  const oldPassword = document.getElementById('oldPassword').value;
  const retypeOldPassword = document.getElementById('retypeOldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const retypeNewPassword = document.getElementById('retypeNewPassword').value;
  const loggedInUsername = getLoggedInUsername(); // Retrieve the username
  const messageDiv = document.getElementById('message'); // Get the message div

  // Clear any previous messages
  messageDiv.innerHTML = '';

  function clearInput() {
    document.getElementById('oldPassword').value = '';
    document.getElementById('retypeOldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('retypeNewPassword').value = '';
  }

  // Check if the logged-in user is attempting to change their own password
  if (loggedInUsername) {
    // Continue with the password change logic
    if (newPassword !== retypeNewPassword || oldPassword !== retypeOldPassword) {
      // Passwords do not match
      messageDiv.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
      clearInput();
      return;
    }

    // Query to update the password in the database
    const query = 'UPDATE account SET password = ? WHERE username = ? AND password = ?';

    // Execute the query to update the password
    dbConnection.query(query, [newPassword, loggedInUsername, oldPassword], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        messageDiv.innerHTML = '<div class="alert alert-danger">Internal server error</div>';
        return;
      }

      if (results.affectedRows === 1) {
        // Password change successful
        messageDiv.innerHTML = '<div class="alert alert-success">Password change successful. You can now log in with your new password.</div>';

        // Clear input fields
        clearInput();
      } else {
        // Old password not found or no change occurred
        messageDiv.innerHTML = '<div class="alert alert-danger">Old password wrong. Please check your old password.</div>';
        clearInput();
      }
    });
  } else {
    console.error('No user is logged in.');
  }
};

// Attach the changePassword function to the form's submit event
document.getElementById('passwordChangeForm').addEventListener('submit', changePassword);

// Function to handle the verification code change request
const changeVerificationCode = (event) => {
  event.preventDefault(); // Prevent the form from submitting via the default behavior
  const oldVerificationCode = document.getElementById('oldVerificationCode').value;
  const retypeOldVerificationCode = document.getElementById('retypeOldVerificationCode').value;
  const newVerificationCode = document.getElementById('newVerificationCode').value;
  const retypeNewVerificationCode = document.getElementById('retypeNewVerificationCode').value;
  const messageDiv = document.getElementById('message2'); // Get the message div

  // Clear any previous messages
  messageDiv.innerHTML = '';

  function clearInput() {
    document.getElementById('oldVerificationCode').value = '';
    document.getElementById('retypeOldVerificationCode').value = '';
    document.getElementById('newVerificationCode').value = '';
    document.getElementById('retypeNewVerificationCode').value = '';
  }

  // Continue with the verification code change logic
  if (newVerificationCode !== retypeNewVerificationCode || oldVerificationCode !== retypeOldVerificationCode) {
    // Verification codes do not match
    messageDiv.innerHTML = '<div class="alert alert-danger">Verification codes do not match.</div>';
    clearInput();
    return;
  }

  // Query to update the verification code in the database
  const updateVerificationCodeQuery = 'UPDATE kode_verifikasi SET kode = ? WHERE kode = ?';

  // Execute the query to update the verification code
  dbConnection.query(updateVerificationCodeQuery, [newVerificationCode, oldVerificationCode], (updateErr, updateResults) => {
    if (updateErr) {
      console.error('Error executing updateVerificationCodeQuery:', updateErr);
      messageDiv.innerHTML = '<div class="alert alert-danger">Internal server error</div>';
      return;
    }

    if (updateResults.affectedRows === 1) {
      // Verification code change successful
      messageDiv.innerHTML = '<div class="alert alert-success">Verification code change successful.</div>';

      // Clear input fields
      clearInput();
    } else {
      // Old verification code not found or no change occurred
      messageDiv.innerHTML = '<div class="alert alert-danger">Old verification code wrong. Please check your old verification code.</div>';
      clearInput();
    }
  });
};

// Attach the changeVerificationCode function to the form's submit event
document.getElementById('verificationCodeChangeForm').addEventListener('submit', changeVerificationCode);

const createAccount = (event) => {
  event.preventDefault(); // Prevent the form from submitting via the default behavior
  const newAccountUsername = document.getElementById('username').value;
  const newAccountPassword = document.getElementById('password').value;
  const newAccountRetypePassword = document.getElementById('retypePassword').value;
  const newAccountRole = document.getElementById('role').value;
  const messageDiv = document.getElementById('message3'); // Get the message div

  // Clear any previous messages
  messageDiv.innerHTML = '';

  function clearInput() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('retypePassword').value = '';
    document.getElementById('role').value = '';
  }

  // Check if passwords match
  if (newAccountPassword !== newAccountRetypePassword) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
    clearInput();
    return;
  }

  // Query to insert a new account into the database
  const query = 'INSERT INTO account (username, password, role) VALUES (?, ?, ?)';

  // Execute the query to insert the new account
  dbConnection.query(query, [newAccountUsername, newAccountPassword, newAccountRole], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      messageDiv.innerHTML = '<div class="alert alert-danger">Internal server error</div>';
      return;
    }

    if (results.affectedRows === 1) {
      // Account creation successful
      messageDiv.innerHTML = '<div class="alert alert-success">Create Account Success.</div>';

      // Clear input fields
      clearInput();
    } else {
      // Account creation failed
      messageDiv.innerHTML = '<div class="alert alert-danger">Create Account Failed</div>';
      clearInput();
    }
  });
};

// Attach the createAccount function to the form's submit event
document.getElementById('createAccountForm').addEventListener('submit', createAccount);


// Handle the radio button change event
document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => {
  e.addEventListener('change', function() {
    const rubahPassword = document.getElementById('rubahPassword');
    const createAccount = document.getElementById('createAccount');
    const SuperAdminOptions = document.getElementById('SuperAdminOptions');
    const adminOptions = document.getElementById('adminOptions');

    if (this.value === "rubahPassword") {
      rubahPassword.style.display = "block";
      createAccount.style.display = "none";
      SuperAdminOptions.style.display = "none";
      adminOptions.style.display = "none";
    } else if (this.value === "createAccount") {
      rubahPassword.style.display = "none";
      createAccount.style.display = "block";
      SuperAdminOptions.style.display = "none";
      adminOptions.style.display = "none";
    } else {
      rubahPassword.style.display = "none";
      createAccount.style.display = "none";
      SuperAdminOptions.style.display = "block";
      adminOptions.style.display = "block";
    }
  });
});


// Handle the button click event
document.getElementById('backButton').addEventListener('click', function () {
  const rubahPassword = document.getElementById('rubahPassword');
  const adminOptions = document.getElementById('adminOptions');
  const SuperAdminOptions = document.getElementById('SuperAdminOptions');

  // Unselect the radio button
  document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => e.checked = false);

  // Toggle the display
  rubahPassword.style.display = rubahPassword.style.display === 'none' ? 'block' : 'none';
  SuperAdminOptions.style.display = SuperAdminOptions.style.display === 'none' ? 'block' : 'none';
  adminOptions.style.display = adminOptions.style.display === 'none' ? 'block' : 'none';
});

// Handle the button click event
document.getElementById('backButton2').addEventListener('click', function () {
  const createAccount = document.getElementById('createAccount');
  const adminOptions = document.getElementById('adminOptions');
  const SuperAdminOptions = document.getElementById('SuperAdminOptions');

  // Unselect the radio button
  document.querySelectorAll('input[type="radio"][name="radio"]').forEach(e => e.checked = false);

  // Toggle the display
  createAccount.style.display = createAccount.style.display === 'none' ? 'block' : 'none';
  SuperAdminOptions.style.display = SuperAdminOptions.style.display === 'none' ? 'block' : 'none';
  adminOptions.style.display = adminOptions.style.display === 'none' ? 'block' : 'none';
});
