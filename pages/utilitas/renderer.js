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

if (sessionToken && loggedInUsername) {
  // User is logged in
  const loggedInDiv = document.querySelector('.logged-in');
  loggedInDiv.textContent = `Logged in as: ${loggedInUsername}`;

  // Check if the loggedInUsername is "super-admin"
  if (loggedInUsername === "super-admin") {
    // Display the adminOptions block
    const adminOptions = document.getElementById('adminOptions');
    adminOptions.style.display = "block";
  }
} else {
  // User is not logged in, handle accordingly (e.g., redirect to login)
  window.location.href = '../login/index.html';
}

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

// // Function to save data to an Excel file
// function saveDataToExcel(data) {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Data');
  
//   const headerRow = [
//     'No.',
//     'Nama',
//     'Jenis Kelamin',
//     'Usia',
//     'Kelurahan',
//     'RT',
//     'RW',
//     'TPS'
//   ];
//   // Assuming 'data' is an array of objects, adjust this part based on your data structure
//   data.forEach((item, index) => {
//     worksheet.addRow([index + 1, item.field1, item.field2, item.field3]);
//   });

//   outputPath.addRow(headerRow);

//   // Create unique filenames for the Excel files
//   const now = Date.now();
//   const editedFileName = `edited_data_${now}.xlsx`;

//   // Specify the paths where the Excel files will be saved
//   const outputPath = path.join(__dirname, '../../backup', editedFileName);
//   // Write the Excel file
//   workbook.xlsx.writeFile(outputPath)
//     .then(() => {
//       console.log(`Data saved to Excel: ${outputPath}`);
//     })
//     .catch((error) => {
//       console.error('Error saving data to Excel:', error);
//     });
// }

// Define the header row for your Excel file
const headerRow = [
  'No.',
  'Nama',
  'Jenis Kelamin',
  'Usia',
  'Kelurahan',
  'RT',
  'RW',
  'TPS'
];
document.getElementById('backUpRadio').addEventListener('change', async () => {
  if (document.getElementById('backUpRadio').checked) {
    if (displayedData) {
      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Edited Data');

      // Add the header row to the worksheet
      worksheet.addRow(headerRow);

      // Add the data rows to the worksheet
      displayedData.forEach((item) => {
        const row = Object.values(item).map((value) => value.toString());
        worksheet.addRow(row);
      });

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
        alert('Data backed up to Excel successfully!');
      } catch (error) {
        console.error('Error saving backup data to Excel:', error);
        alert('Error saving backup data to Excel. Please try again.');
      }
    } else {
      console.log('No displayed data available for backup.');
    }
  }
});
