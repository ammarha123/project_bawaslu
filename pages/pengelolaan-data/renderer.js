window.$ = window.jQuery = require('jquery');

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

// Import the xlsx library
const XLSX = require('xlsx');

// Get a reference to the file input element
const excelFileInput = document.querySelector('#fileInput');
const deleteSelectedButton = document.querySelector('#deleteSelectedButton');

// Store selected rows
const selectedRows = new Set();

// Add an event listener to the file input for when a file is selected
excelFileInput.addEventListener('change', (event) => {
  // Get the selected file
  const selectedFile = event.target.files[0];

  // Check if a file was selected
  if (selectedFile) {
    // Use the FileReader API to read the file
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Assuming you have only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Parse the sheet into an array of objects
      const excelData = XLSX.utils.sheet_to_json(sheet);

      // Display the Excel data in your HTML table
      displayExcelData(excelData);

      // Store the displayed data in session storage
      saveDataToSessionStorage(excelData);
    };

    // Read the file as binary data
    reader.readAsBinaryString(selectedFile);
  }
});

// Function to save the displayed data to session storage
function saveDataToSessionStorage(data) {
  // Convert the data to a JSON string
  const dataJSON = JSON.stringify(data);

  // Store the data in session storage
  sessionStorage.setItem('displayedData', dataJSON);

  // Log to the console when data is stored
  console.log('Data saved to session storage:', data);
}

// Function to retrieve displayed data from session storage
function getDisplayDataFromSessionStorage() {
  const dataJSON = sessionStorage.getItem('displayedData');
  if (dataJSON) {
    return JSON.parse(dataJSON);
  }
  return null;
}

// Function to toggle row selection and highlight
function toggleRowSelection(rowIndex) {
  if (selectedRows.has(rowIndex)) {
    selectedRows.delete(rowIndex);
  } else {
    selectedRows.add(rowIndex);
  }
  updateRowStyles();
}

// Function to update row styles based on selection
function updateRowStyles() {
  const tableRows = document.querySelectorAll('#excelDataTable tr');
  tableRows.forEach((row, index) => {
    if (selectedRows.has(index)) {
      row.classList.add('selected-row');
      row.classList.add('table-danger'); // Add the second class separately
    } else {
      row.classList.remove('selected-row');
      row.classList.remove('table-danger'); // Remove the second class separately
    }
  });
}

// Event delegation for row selection
document.querySelector('#excelDataTable').addEventListener('click', (event) => {
  if (event.target.tagName === 'TD') {
    const rowIndex = event.target.parentElement.rowIndex - 1; // Subtract 1 for the header row
    toggleRowSelection(rowIndex);
  }
});

const messageDiv = document.getElementById('message');
const verificationInput = document.getElementById('verificationInput');
const deleteButton = document.getElementById('confirmDeleteButton');

// Define displayedData and retrieve it from session storage
let displayedData = getDisplayDataFromSessionStorage();
// Event listener for the "Delete Selected" button
deleteButton.addEventListener('click', () => {
  // Get the entered verification code
  const enteredCode = verificationInput.value;

  // Replace 'YOUR_VERIFICATION_CODE' with the actual verification code you want to use
  const expectedCode = 'delete';

  if (enteredCode === expectedCode) {
    // Delete selected rows
    const table = document.querySelector('#excelDataTable');
    const selectedIndices = Array.from(selectedRows);
    selectedIndices.sort((a, b) => b - a);

    // Remove the deleted rows from the displayedData array
    selectedIndices.forEach((index) => {
      displayedData.splice(index, 1);
      table.deleteRow(index);
      selectedRows.delete(index);
    });

    // Update the session storage with the modified data
    saveDataToSessionStorage(displayedData);

    $('#myModal').modal('hide');

    // After deleting rows, update row styles
    updateRowStyles();

    // Clear the error message and verification input field
    messageDiv.textContent = '';
    verificationInput.value = '';
  } else {
    // Display an error message in the 'messageDiv'
    messageDiv.textContent = 'Incorrect verification code. Please try again.';
    verificationInput.value = ''; // Clear the input field
  }
});


// Initialize a variable to keep track of the last index
let lastIndex = 0;

// Get a reference to the HTML table with the id "excelDataTable"
const table = document.querySelector('#excelDataTable');

// Get a reference to the element where you want to display the total count
const totalDataCount = document.querySelector('#totalDataCount');
const totalLakiLakiCount = document.querySelector('#totalLakiLakiCount');
const totalPerempuanCount = document.querySelector('#totalPerempuanCount');

// Function to display Excel data in the HTML table without replacing existing data
function displayExcelData(data) {
  const tableBody = document.querySelector('#excelDataTable');

  // Initialize variables to keep track of totals
  let totalLakiLaki = 0;
  let totalPerempuan = 0;

  // Initialize a variable to keep track of the last index
  let lastIndex = 0;

  // Clear existing options in the TPS dropdown
  const TPSDropdown = document.querySelector('#TPSDropdown');
  TPSDropdown.innerHTML = '<option value="">Select TPS</option>';

  // Create a Set to store unique TPS values
  const uniqueTPSValues = new Set();

  // Iterate through the Excel data and create table rows
  data.forEach((row) => {
    lastIndex++; // Increment the last index
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${lastIndex}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td>${row.RW}</td>
      <td>${row.TPS}</td>
    `;

    // Append the new row to the existing table
    tableBody.appendChild(tableRow);

    // Add TPS value to the uniqueTPSValues Set
    uniqueTPSValues.add(row.TPS);
  });

  // Populate the TPS dropdown with unique TPS values
  uniqueTPSValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    TPSDropdown.appendChild(option);
  });

  // After displaying the Excel data, update the total data count and gender counts
  updateTotalDataCount();
  updateTotalGenderCount();

  // Store the displayed data in session storage
  saveDataToSessionStorage(data);
}

// Function to update the total data count
function updateTotalDataCount() {
  // Get the total number of rows in the table (excluding the header)
  const rowCount = table.rows.length; // Subtract 1 for the header row

  // Update the content of the totalDataCount element
  totalDataCount.textContent = `${rowCount}`;
}

// Function to update the total Perempuan and Laki-laki count
function updateTotalGenderCount() {
  // Reset counts
  totalPerempuan = 0;
  totalLakiLaki = 0;

  // Loop through the rows (excluding the header) and count Perempuan and Laki-laki
  for (let i = 0; i < table.rows.length; i++) {
    const jenisKelaminCell = table.rows[i].cells[2].textContent; // Assuming "Jenis Kelamin" is in the 3rd cell (index 2)

    if (jenisKelaminCell === 'Laki-Laki') {
      totalLakiLaki++;
    } else if (jenisKelaminCell === 'Perempuan') {
      totalPerempuan++;
    }
  }

  // Update the content of the totalPerempuanCount and totalLakiLakiCount elements
  totalPerempuanCount.textContent = `${totalPerempuan}`;
  totalLakiLakiCount.textContent = `${totalLakiLaki}`;

  
}

// Function to filter and display rows based on selected TPS
function filterAndDisplayRows(selectedTPS) {
  const tableRows = document.querySelectorAll('#excelDataTable tr');

  // Hide all rows by default
  tableRows.forEach((row) => {
    row.style.display = 'none';
  });

  // Show rows that match the selected TPS value
  tableRows.forEach((row) => {
    const tpsCell = row.cells[7].textContent; // Assuming TPS is in the 8th cell (index 7)
    if (tpsCell === selectedTPS || selectedTPS === '') {
      row.style.display = ''; // Show the row
    }
  });
}

// Event listener for the "TPSDropdown" change event
document.getElementById('TPSDropdown').addEventListener('change', (event) => {
  const selectedTPS = event.target.value;
  filterAndDisplayRows(selectedTPS);
});

// Event listener for the "TPSDropdown" change event
document.getElementById('TPSDropdown').addEventListener('change', (event) => {
  const selectedTPS = event.target.value;
  filterAndDisplayRows(selectedTPS);

  // Update the content of the selectedTPSValue span
  const selectedTPSValueSpan = document.getElementById('selectedTPSValue');
  selectedTPSValueSpan.textContent = selectedTPS;
});

// Function to filter and display rows based on search query and column
function searchAndDisplayRows(query, column) {
  const tableRows = document.querySelectorAll('#excelDataTable tr');

  // Hide all rows by default
  tableRows.forEach((row) => {
    row.style.display = 'none';
  });

  // Show rows that match the search query in the selected column
  tableRows.forEach((row) => {
    const cellIndex = {
      nama: 1,
      jenisKelamin: 2,
      usia: 3,
      kelurahan: 4,
      rt: 5,
      rw: 6,
      tps: 7,
    }[column]; // Map column names to cell indices

    if (!cellIndex) return;

    const cellValue = row.cells[cellIndex].textContent;

    if (cellValue.toLowerCase().includes(query.toLowerCase()) || query === '') {
      row.style.display = ''; // Show the row
    }
  });
}

// Event listener for the search input's keyup event
document.getElementById('searchInput').addEventListener('keyup', () => {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value;
  const columnSelect = document.getElementById('columnSelect');
  const selectedColumn = columnSelect.value;
  searchAndDisplayRows(searchQuery, selectedColumn);
});


// document.querySelector('#excelDataTable').addEventListener('DOMSubtreeModified', updateTotalDataCount, updateTotalPerempuanCount, updateTotalLakiLakiCount);
document.querySelector('#excelDataTable').addEventListener('DOMSubtreeModified', function () {
  updateTotalDataCount()
  updateTotalGenderCount()
  });

// Function to retrieve Kecamatan data
const getKecamatan = () => {
  const kecamatanDropdown = document.getElementById('kecamatanDropdown');

  // Clear existing options
  kecamatanDropdown.innerHTML = '<option value="">Select Kecamatan</option>';

  // Query to fetch Kecamatan values from the database
  const query = 'SELECT kecamatan FROM data';

  dbConnection.query(query, (err, rows) => {
    if (err) {
      console.error('Error fetching Kecamatan data:', err);
      return;
    }

    // Populate the Kecamatan dropdown with data
    rows.forEach((row) => {
      const option = document.createElement('option');
      option.value = row.kecamatan;
      option.textContent = row.kecamatan;
      kecamatanDropdown.appendChild(option);
    });
  });
};

// Call the function to populate the dropdown when the DOM is ready
document.addEventListener('DOMContentLoaded', getKecamatan);

// Function to retrieve Desa/Kelurahan data based on selected Kecamatan
const getDesaByKecamatan = (selectedKecamatan) => {
  const desaDropdown = document.getElementById('desaDropdown');

  // Clear existing options
  desaDropdown.innerHTML = '<option value="">Select Desa/Kel</option>';

  // Query to fetch Desa/Kel values based on the selected Kecamatan
  const query = `
    SELECT name 
    FROM desa 
    WHERE kecamatan_id = (
      SELECT id 
      FROM data 
      WHERE kecamatan = ?
    )`;

  // Execute the SQL query
  dbConnection.query(query, [selectedKecamatan], (err, rows) => {
    if (err) {
      console.error('Error fetching Desa/Kel data:', err);
      return;
    }

    // Populate the Desa/Kel dropdown with data
    rows.forEach((row) => {
      const option = document.createElement('option');
      option.value = row.name;
      option.textContent = row.name;
      desaDropdown.appendChild(option);
    });
  });
};

// Event listener for the Kecamatan dropdown change event
document.getElementById('kecamatanDropdown').addEventListener('change', () => {
  const selectedKecamatan = document.getElementById('kecamatanDropdown').value;
  const selectedKecamatanHeader = document.getElementById('selectedKecamatanHeader');

  if (selectedKecamatan) {
    // Call the function to populate the Desa/Kel dropdown
    getDesaByKecamatan(selectedKecamatan);
    selectedKecamatanHeader.textContent = `${selectedKecamatan}`;
  } else {
    // Clear the Desa/Kel dropdown if no Kecamatan is selected
    const desaDropdown = document.getElementById('desaDropdown');
    desaDropdown.innerHTML = '<option value="">Select Desa/Kel</option>';
    selectedKecamatanHeader.textContent = ` `;
  }
});


// Event listener for the Kecamatan dropdown change event
document.getElementById('desaDropdown').addEventListener('change', () => {
  const selectedDesa = document.getElementById('desaDropdown').value;
  const selectedDesaKelHeader = document.getElementById('selectedDesaKelHeader');

  if (selectedDesa) {
    // Update the content of the selectedDesaKelHeader with the selected Desa/Kel
    selectedDesaKelHeader.textContent = `${selectedDesa}`;
  } else {
    // If nothing is selected, reset the header to its default text
    selectedDesaKelHeader.textContent = '';
  }


  // Define the file path based on the selected Kecamatan
  let filePath = '';

  // Construct the SQL query to fetch the file path for the selected Kecamatan
  const sql = `SELECT file FROM desa WHERE name = '${selectedDesa}'`;

  // Query your database to get the file path
  dbConnection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching file path:', err);
      return;
    }

    // Check if a result was found
    if (rows.length > 0) {
      const fileRow = rows[0]; // Assuming you have one row per Kecamatan

      // Retrieve the file path from the database row
      filePath = `../../database/${fileRow.file}`;

      // Fetch and load the Excel file
      fetch(filePath)
        .then((response) => response.blob()) // Get the Excel file as a blob
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            // Assuming you have only one sheet in the Excel file
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Parse the sheet into an array of objects
            const excelData = XLSX.utils.sheet_to_json(sheet);

            // Display the Excel data in your HTML table
            displayExcelData(excelData);
          };

          // Read the blob as binary data
          reader.readAsBinaryString(blob);
        })
        .catch((error) => {
          console.error('Error reading Excel file:', error);
        });
    } else {
      console.error('File path not found for selected Kecamatan');
    }
  });
});

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Function to export data to Excel
const exportToExcel = () => {
  // Get the table element by its ID
  const table = document.querySelector('#excelDataTable');

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Define the header row
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

  // Add the header row to the worksheet
  worksheet.addRow(headerRow);

  // Add data rows to the worksheet
  table.querySelectorAll('tbody tr').forEach((row) => {
    const rowData = [];
    row.querySelectorAll('td').forEach((cell) => {
      rowData.push(cell.textContent);
    });
    worksheet.addRow(rowData);
  });

  // Create a unique filename for the Excel file
  // Specify the path where the Excel file will be saved
  const fileName = `data_${Date.now}.xlsx`;
  const downloadFolder = '../../../../Downloads';
  const outputPath = path.join(__dirname, downloadFolder, fileName);

  // Write the Excel file to the specified path
  workbook.xlsx.writeFile(outputPath)
    .then(() => {
      console.log(`Excel file saved to: ${outputPath}`);
      alert('Data exported to Excel successfully!');
    })
    .catch((error) => {
      console.error('Error exporting data to Excel:', error);
      alert('Error exporting data to Excel. Please try again.');
    });
};

// Attach the exportToExcel function to a button click event
const exportButton = document.getElementById('exportExcelButton');
if (exportButton) {
  exportButton.addEventListener('click', exportToExcel);
}

// // Store the original data when the page loads
// const originalData = [];

// // Function to capture the original data
// function captureOriginalData() {
//   const originalData = [];

//   // Capture the original data from the HTML table
//   const table = document.querySelector('#excelDataTable');
//   table.querySelectorAll('tbody tr').forEach((row) => {
//     const rowData = [];
//     row.querySelectorAll('td').forEach((cell) => {
//       rowData.push(cell.textContent);
//     });
//     originalData.push(rowData);
//   });

//   // Store the captured original data in a data attribute
//   table.dataset.originalData = JSON.stringify(originalData);
// }

// // Add an event listener to capture the original data when the page is loaded
// document.addEventListener('DOMContentLoaded', captureOriginalData);



// // Define originalData at the top-level scope
// let originalData = null;

// // Function to fetch original data from the database
// const fetchOriginalData = (selectedDesa, callback) => {
//   // Replace these lines with actual database queries to retrieve the file path
//   const sql = `SELECT file FROM desa WHERE name = '${selectedDesa}'`;

//   // Execute the SQL query to fetch the file path
//   dbConnection.query(sql, (error, result) => {
//     if (error) {
//       console.error('Error fetching file path:', error);
//       return;
//     }

//     if (result.length === 0) {
//       console.error('No file path found for the selectedDesa:', selectedDesa);
//       return;
//     }

//     const filePath = `../../database/bawaslu-2.xlsx`

//     // Load the Excel file from the retrieved file path
//     const workbook = new ExcelJS.Workbook();

//     workbook.xlsx.read(filePath)
//       .then(() => {
//         const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first worksheet

//         const originalData = [];

//         worksheet.eachRow((row, rowNumber) => {
//           if (rowNumber === 1) {
//             // Skip the header row
//             return;
//           }

//           const rowData = row.values.map(value => value.toString());
//           originalData.push(rowData);
//         });

//         // Pass the original data to the callback function
//         callback(originalData);

//         console.log('Original data:', originalData); // Log the original data
//       })
//       .catch((error) => {
//         console.error('Error reading Excel file:', error);
//         return;
//       });
//   });
// };

// Function to export data to Excel
const saveToExcel = () => {
  // Get the table element by its ID
  const table = document.querySelector('#excelDataTable');

  // Create a new Excel workbook and worksheet for original data
  const originalWorkbook = new ExcelJS.Workbook();
  const originalWorksheet = originalWorkbook.addWorksheet('Original Data');

  // Create a new Excel workbook and worksheet for edited data
  const editedWorkbook = new ExcelJS.Workbook();
  const editedWorksheet = editedWorkbook.addWorksheet('Edited Data');

  // Define the header row
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

  // Add the header row to both worksheets
  originalWorksheet.addRow(headerRow);
  editedWorksheet.addRow(headerRow);

  // Get the edited data from the table
  const rows = table.querySelectorAll('tbody tr');
  if (rows.length === 0) {
    alert('No data to save.');
    return;
  }

  rows.forEach((row, index) => {
    const rowData = [];
    row.querySelectorAll('td').forEach((cell) => {
      rowData.push(cell.textContent);
    });

    originalWorksheet.addRow(rowData); // Add data from originalData
    editedWorksheet.addRow(rowData); // Add data from the table
  });

  // Create unique filenames for the Excel files
  const now = Date.now();
  const originalFileName = `original_data_${now}.xlsx`;
  const editedFileName = `edited_data_${now}.xlsx`;

  // Specify the paths where the Excel files will be saved
  const originalDataPath = path.join(__dirname, '../../restore', originalFileName);
  const editedDataPath = path.join(__dirname, '../../backup', editedFileName);

  // Write the Excel files to the specified paths
  originalWorkbook.xlsx.writeFile(originalDataPath)
    .then(() => {
      console.log(`Original Excel file saved to: ${originalDataPath}`);
    })
    .catch((error) => {
      console.error('Error saving original data to Excel:', error);
    });

  editedWorkbook.xlsx.writeFile(editedDataPath)
    .then(() => {
      console.log(`Edited Excel file saved to: ${editedDataPath}`);
      alert('Data saved to Excel successfully!');
    })
    .catch((error) => {
      console.error('Error saving edited data to Excel:', error);
      alert('Error saving data to Excel. Please try again.');
    });
};

// Attach the exportToExcel function to a button click event
const saveButton = document.getElementById('saveButton');
if (saveButton) {
  saveButton.addEventListener('click', saveToExcel);
}

// // Attach the exportToExcel function to a button click event
// const saveButton = document.getElementById('saveButton');
// if (saveButton) {
//   saveButton.addEventListener('click', () => {
//     const selectedDesa = document.getElementById('desaDropdown').value;
//     // Fetch the original data from the database
//     fetchOriginalData(selectedDesa, (originalData) => {
//       // Get the edited data from the table
//       const rows = table.querySelectorAll('tbody tr');
//       if (rows.length === 0) {
//         alert('No data to save.');
//         return;
//       }

//       const editedData = [];
//       rows.forEach((row) => {
//         const rowData = [];
//         row.querySelectorAll('td').forEach((cell) => {
//           rowData.push(cell.textContent);
//         });
//         editedData.push(rowData);
//       });

//       // Pass the original data and edited data to the saveToExcel function
//       saveToExcel(originalData, editedData);
//     });
//   });
// }


// Function to sort table data
function sortTable(column, order) {
  const table = document.getElementById('excelDataTable');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.getElementsByTagName('tr'));

  // Sort the rows based on the specified column and order
  rows.sort((a, b) => {
    const aValue = a.querySelector(`td[data-column="${column}"]`).textContent;
    const bValue = b.querySelector(`td[data-column="${column}"]`).textContent;

    if (order === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Remove all rows from the table
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Re-add sorted rows to the table
  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

// Event listener for table header clicks to trigger sorting
document.querySelector('#excelData thead').addEventListener('click', (event) => {
  if (event.target.tagName === 'TH' && event.target.hasAttribute('data-column')) {
    const column = event.target.getAttribute('data-column');
    const currentOrder = event.target.getAttribute('data-order') || 'asc';

    console.log('Sorting column:', column);
    console.log('Current order:', currentOrder);

    // Toggle the sorting order
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    event.target.setAttribute('data-order', newOrder);

    // Remove sorting indicators from other columns
    const headers = document.querySelectorAll('table thead th');
    headers.forEach((header) => {
      if (header !== event.target) {
        header.removeAttribute('data-order');
      }
    });

    // Sort the table
    sortTable(column, newOrder);
  }
});

// // Function to send data from #excelDataTable to the main process
// function sendDataToUtilitas() {
//   const table = document.querySelector('#excelDataTable');
//   const data = [];
  
//   // Iterate through table rows and cells to extract data
//   for (let i = 0; i < table.rows.length; i++) {
//     const row = table.rows[i];
//     const rowData = [];
//     for (let j = 0; j < row.cells.length; j++) {
//       rowData.push(row.cells[j].innerText);
//     }
//     data.push(rowData);
//   }

//   // Send the data to the main process via IPC
//   ipcRenderer.send('send-data-to-utilitas', data);
//   console.log('Data sent to Utilitas:', data); // Log the data being sent
// }