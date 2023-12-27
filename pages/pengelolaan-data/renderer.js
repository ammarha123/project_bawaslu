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
  // const loggedInDiv = document.querySelector('.logged-in');
  // loggedInDiv.textContent = `Logged in as: ${loggedInUsername}`;
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

// Function to update the counts based on the displayed data
function updateCounts() {
  const {
    totalData,
    totalLakiLaki,
    totalPerempuan,
  } = countTotalDataAndGender(matchingRows);

  // Update the corresponding HTML elements
  totalDataCount.textContent = totalData;
  totalLakiLakiCount.textContent = totalLakiLaki;
  totalPerempuanCount.textContent = totalPerempuan;
}

// Initialize a variable to keep track of the last index
let lastIndex = 0;

// Get a reference to the HTML table with the id "excelDataTable"
const table = document.querySelector('#excelDataTable');

// Get a reference to the element where you want to display the total count
const totalDataCount = document.querySelector('#totalDataCount');
const totalLakiLakiCount = document.querySelector('#totalLakiLakiCount');
const totalPerempuanCount = document.querySelector('#totalPerempuanCount');

let entireDataset = [];

// Function to set the entire dataset
function setEntireDataset(data) {
  entireDataset = data;
}

// Function to count the total data, Laki-laki, and Perempuan from the entire data
function countTotalDataAndGender(data) {
  // Counters for the total data, Laki-laki, and Perempuan
  let totalData = data.length;
  let totalLakiLaki = 0;
  let totalPerempuan = 0;

  // Iterate through the data to count Laki-laki and Perempuan
  data.forEach((row) => {
    const jenisKelamin = row['Jenis Kelamin'];
    if (jenisKelamin === 'L') {
      totalLakiLaki++;
    } else if (jenisKelamin === 'P') {
      totalPerempuan++;
    }
  });

  return {
    totalData,
    totalLakiLaki,
    totalPerempuan,
  };
}

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

filteredExcelData = []; 

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
      const excelData = XLSX.utils.sheet_to_json(sheet, { header: ['No.', 'Nama', 'Jenis Kelamin', 'Kecamatan', 'Usia', 'Kelurahan', 'RT', 'RW', 'TPS'] }); // Define headers to match your data

      // Filter and display the Excel data where the Kelurahan/Desa matches the selected data
      const selectedDesa = document.getElementById('desaDropdown').value; // Get the selected Desa/Kel value
      const filteredExcelData = excelData.filter((row) => {
        // Assuming 'Kelurahan' is the actual column name for Kelurahan/Desa
      const kelurahanDesa = row['Kelurahan']; // Replace with the correct column name

      // Ensure the Kelurahan/Desa value is a string, and trim it
      return typeof kelurahanDesa === 'string' && kelurahanDesa.trim() === selectedDesa.trim();
      });

      // Display the filtered Excel data in your HTML table
      displayExcelData(filteredExcelData, currentPage);
      updateTableAndDropdown();
      console.log("selected: ", filePath);
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

// Define global variables to track the current page and rows per page
let currentPage = 1;
let rowsPerPage = 10; // You can change the default value as needed
let matchingRows = []; // Maintain a variable for the matching rows

// Function to display Excel data with pagination
function displayExcelData(data, pageNumber) {
  // Clear the existing table
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';

  // Calculate the start and end indices for the current page
  const startIndex = (pageNumber - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);

  // Clear existing options in the TPS dropdown
  const TPSDropdown = document.querySelector('#TPSDropdown');
  TPSDropdown.innerHTML = '<option value="">Select TPS</option>';

  // Create a Set to store unique TPS values
  const uniqueTPSValues = new Set();

  // Create an array to store the matching rows
  matchingRows = data.slice(); // Copy the data to matchingRows

  // Iterate through the data for the current page
  for (let i = startIndex; i < endIndex; i++) {
    // Create table rows and append them to the table body
    const row = matchingRows[i]; // Use matchingRows instead of data
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kecamatan}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td>${row.RW}</td>
      <td>${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);

    // Add TPS value to the uniqueTPSValues Set
    uniqueTPSValues.add(row.TPS);
  }

  // Populate the TPS dropdown with unique TPS values
  uniqueTPSValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    TPSDropdown.appendChild(option);
  });

  // Call the new function to count the total data, Laki-laki, and Perempuan
  const {
    totalData,
    totalLakiLaki,
    totalPerempuan,
  } = countTotalDataAndGender(matchingRows); // Use matchingRows

  // Update the corresponding HTML elements
  totalDataCount.textContent = totalData;
  totalLakiLakiCount.textContent = totalLakiLaki;
  totalPerempuanCount.textContent = totalPerempuan;

  // Store the displayed data in session storage
  saveDataToSessionStorage(matchingRows);

  updatePaginationUI(pageNumber, matchingRows.length);
}



// Function to update the pagination UI
function updatePaginationUI(currentPage, totalRows) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;

  // Disable/enable the "Previous" and "Next" buttons based on the current page
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

function updateTable() {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = ''; // Clear the existing table before displaying results

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, matchingRows.length);

  const encounteredNames = {}; // Object to store encountered names
  // Track duplicate names in an array
const duplicateNames = [];


  for (let i = startIndex; i < endIndex; i++) {
    const row = matchingRows[i];
    const tableRow = document.createElement('tr');
    const continuousIndex = i + 1; // Updated index
    tableRow.innerHTML = `
      <td>${continuousIndex}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row['Kecamatan']}</td>
      <td>${row['Usia']}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td>${row.RW}</td>
      <td>${row.TPS}</td>
    `;

    // Check for duplicate names and apply styling
  if (encounteredNames[row.Nama]) {
    if (!duplicateNames.includes(row.Nama)) {
      duplicateNames.push(row.Nama);
    }
    tableRow.classList.add('table-warning'); // Add 'table-warning' class
  } else {
    encounteredNames[row.Nama] = true;
  }

    tableBody.appendChild(tableRow);
  }

  // Update the pagination UI
  updatePaginationUI(currentPage, matchingRows.length);

  // Clear existing duplicate names
const duplicateNamesList = document.getElementById('duplicateNamesList');
duplicateNamesList.innerHTML = '';

// Display the duplicate names in the HTML
duplicateNames.forEach((name) => {
  const listItem = document.createElement('li');
  listItem.textContent = name;
  duplicateNamesList.appendChild(listItem);
})

// Check if there are duplicate names
if (duplicateNames.length > 0) {
  // If there are duplicate names, make the section visible
  const duplicateNamesSection = document.getElementById('duplicateNamesSection');
  duplicateNamesSection.style.display = 'block';
} else {
  // If there are no duplicate names, hide the section
  const duplicateNamesSection = document.getElementById('duplicateNamesSection');
  duplicateNamesSection.style.display = 'none';
}

  // Get unique TPS values from the entire matchingRows dataset and populate the TPS dropdown
  const uniqueTPSValues = Array.from(new Set(matchingRows.map((row) => row.TPS)));

  const TPSDropdown = document.querySelector('#TPSDropdown');
  TPSDropdown.innerHTML = '<option value="">Select TPS</option>';
  uniqueTPSValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    TPSDropdown.appendChild(option);
  });
}

const messageDiv = document.getElementById('message');
const verificationInput = document.getElementById('verificationInput');
const deleteButton = document.getElementById('confirmDeleteButton');

// Define displayedData and retrieve it from session storage
let displayedData = getDisplayDataFromSessionStorage();
deleteButton.addEventListener('click', () => {
  // Get the entered verification code
  const enteredCode = verificationInput.value;

  // Replace 'YOUR_VERIFICATION_CODE' with the actual verification code you want to use
  const expectedCode = 'delete';

  if (enteredCode === expectedCode) {
    // Delete selected rows from matchingRows
    const selectedIndices = Array.from(selectedRows);
    selectedIndices.sort((a, b) => b - a);

    // Remove the deleted rows from the matchingRows array
    selectedIndices.forEach((index) => {
      matchingRows.splice(index, 1);
      selectedRows.delete(index);
    });

    // Rebuild the entire table to reflect the changes
    displayExcelData(matchingRows, currentPage);

    // Update the session storage with the modified data
    saveDataToSessionStorage(matchingRows);

    $('#myModal').modal('hide');

    // After deleting rows, update row styles
    updateRowStyles();

    // Update the counts based on the modified matchingRows
    updateCounts();

    updateTable();

    // Clear the error message and verification input field
    messageDiv.textContent = '';
    verificationInput.value = '';
  } else {
    // Display an error message in the 'messageDiv'
    messageDiv.textContent = 'Incorrect verification code. Please try again.';
    verificationInput.value = ''; // Clear the input field
  }
});

// Event listener for the "Rows per page" select element
const rowsPerPageSelect = document.getElementById('rowsPerPage');
rowsPerPageSelect.addEventListener('change', () => {
  rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
  currentPage = 1; // Reset to the first page
  updateTable(); // Update the displayed results
});

// Event listener for the "Previous" button
const prevPageButton = document.getElementById('prevPage');
prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateTable(); // Update the displayed results
  }
});

// Event listener for the "Next" button
const nextPageButton = document.getElementById('nextPage');
nextPageButton.addEventListener('click', () => {
  const totalPages = Math.ceil(matchingRows.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable(); // Update the displayed results
  }
});

// In your search function, update the matching rows
function searchAndDisplayRows(query, selectedColumn) {
  const displayedData = getDisplayDataFromSessionStorage();
  if (!displayedData) {
    return; // No data to search in
  }

  matchingRows = displayedData.filter((row) => {
    const cellValue = row[selectedColumn];
    return cellValue && cellValue.toString().toLowerCase().includes(query.toLowerCase());
  });

  currentPage = 1; // Reset to the first page
  updateTable();
}

// Event listener for the search input's keyup event
document.getElementById('searchInput').addEventListener('keyup', () => {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value;
  const columnSelect = document.getElementById('columnSelect');
  const selectedColumn = columnSelect.value; // This gets the selected column from the dropdown

  // Now you can use the selectedColumn to perform the search
  searchAndDisplayRows(searchQuery, selectedColumn);
});

// Function to filter and display rows based on selected TPS
function filterAndDisplayRows(selectedTPS) {
  matchingRows = filteredExcelData.filter((row) => {
    const tpsValue = row.TPS; // Assuming 'TPS' is the correct column name
    return selectedTPS === '' || tpsValue === selectedTPS;
  });

  currentPage = 1; // Reset to the first page
  updateTable();
   // Update the counts based on the modified matchingRows
  updateCounts();
  // Call the function to update the TPS dropdown with unique values without changing the selection
  updateTPSDropdown(matchingRows, selectedTPS);
} 

// Function to get unique TPS values from the entire dataset
function getUniqueTPSValues(data) {
  return Array.from(new Set(data.map((row) => row.TPS)));
}

// Function to update the TPS dropdown with unique TPS values from the displayed data
function updateTPSDropdown(data, selectedTPS) {
  const uniqueTPSValues = getUniqueTPSValues(data);

  const TPSDropdown = document.querySelector('#TPSDropdown');
  const currentSelection = TPSDropdown.value; // Store the currently selected TPS

  TPSDropdown.innerHTML = '<option value="">Select TPS</option>';

  uniqueTPSValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    TPSDropdown.appendChild(option);
  });

  // Set the selected TPS back to the dropdown, if it exists in the updated options
  if (uniqueTPSValues.includes(selectedTPS)) {
    TPSDropdown.value = selectedTPS;
  }
}

// Function to update the table and TPS dropdown
function updateTableAndDropdown() {
  updateTable();
  updateTPSDropdown(matchingRows);
}

// Event listener for the "TPSDropdown" change event
document.getElementById('TPSDropdown').addEventListener('change', (event) => {
  const selectedTPS = event.target.value;
  filterAndDisplayRows(selectedTPS);

  // Update the content of the selectedTPSValue span
  const selectedTPSValueSpan = document.getElementById('selectedTPSValue');
  selectedTPSValueSpan.textContent = selectedTPS;
});

// Initial display, assuming no search query
updateTable();

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

// Function to generate a PDF from matchingRows
function generatePDF(matchingRows) {
  const doc = new jsPDF();

  // Define the columns for the PDF
  const columns = ['No.', 'Nama', 'Jenis Kelamin', 'Usia', ,'Kecamatan', 'Kelurahan', 'RT', 'RW', 'TPS'];

  // Create an empty array to store the data for the PDF
  const data = [];

  // Add each row from matchingRows to the data array
  matchingRows.forEach((row, index) => {
    data.push([index + 1, row.Nama, row['Jenis Kelamin'], row.Usia, row.Kecamatan, row.Kelurahan, row.RT, row.RW, row.TPS]);
  });

  // Set the position for the table (you can adjust these values)
  const x = 10;
  const y = 10;

  // Create the PDF table
  doc.autoTable({
    head: [columns],
    body: data,
    startY: y,
  });

  // Save the PDF to a file
  const pdfPath = 'matchingRows.pdf';
  doc.save(pdfPath);

  console.log(`PDF saved as ${pdfPath}`);
}

// Add an event listener to the "Ekspor PDF" button
document.getElementById('exportPDFButton').addEventListener('click', () => {
  // Call the generatePDF function with your matchingRows data
  generatePDF(matchingRows);
});

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
    'Kecamatan',
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
    'Kecamatan',
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

// Get references to the sorting button and sorting popup
const sortingButton = document.getElementById('sortingButton');
const sortingPopup = document.getElementById('sortingPopup');

sortingButton.addEventListener('click', () => {
  if (sortingPopup.style.display === 'block') {
    // If the popup is open, close it
    sortingPopup.style.display = 'none';
    sortingButton.textContent = 'Open Sorting Options';
  } else {
    // If the popup is closed, open it
    sortingPopup.style.display = 'block';
    sortingButton.textContent = 'Close Sorting Options';
  }
});

const applySortingButton = document.getElementById('applySorting');
applySortingButton.addEventListener('click', () => {
  // Get selected sorting options and apply sorting logic here
  // For example, you can use the values of select elements (e.g., sortNama) to sort your data
  // Hide the sorting popup
  sortingPopup.style.display = 'none';
  sortingButton.textContent = 'Open Sorting Options';
});

// Add a click event listener to the Apply Sorting button
applySortingButton.addEventListener('click', () => {
  // Determine the selected sorting options for each row
  const sortingNama = document.getElementById('sortingNama').value;
  const sortingJenisKelamin = document.getElementById('sortingJenisKelamin').value;
  const sortingKelurahan = document.getElementById('sortingKelurahan').value;
  const sortingUsia = document.getElementById('sortingUsia').value;
  const sortingRT = document.getElementById('sortingRT').value;
  const sortingRW = document.getElementById('sortingRW').value;
  const sortingTPS = document.getElementById('sortingTPS').value;

  // Define a sorting function that handles both strings and numbers
  const customSort = (a, b, sortOrder) => {
    if (isNaN(a) && isNaN(b)) {
      // Both values are strings, perform string comparison
      return sortOrder * a.localeCompare(b);
    } else {
      // At least one value is numeric, perform numeric comparison
      return sortOrder * (Number(a) - Number(b));
    }
  };

  // Perform the sorting based on the selected options
  if (sortingNama !== 'noFilter') {
    if (sortingNama === 'asc') {
      // Sort Nama in ascending order
      matchingRows.sort((a, b) => customSort(a.Nama, b.Nama, 1));
    } else if (sortingNama === 'desc') {
      // Sort Nama in descending order
      matchingRows.sort((a, b) => customSort(a.Nama, b.Nama, -1));
    }
  }

  if (sortingJenisKelamin !== 'noFilter') {
    if (sortingJenisKelamin === 'asc') {
      // Sort Jenis Kelamin in ascending order
      matchingRows.sort((a, b) => customSort(a['Jenis Kelamin'], b['Jenis Kelamin'], 1));
    } else if (sortingJenisKelamin === 'desc') {
      // Sort Jenis Kelamin in descending order
      matchingRows.sort((a, b) => customSort(a['Jenis Kelamin'], b['Jenis Kelamin'], -1));
    }
  }

  if (sortingKelurahan !== 'noFilter') {
    if (sortingKelurahan === 'asc') {
      // Sort Kelurahan in ascending order
      matchingRows.sort((a, b) => customSort(a.Kelurahan, b.Kelurahan, 1));
    } else if (sortingKelurahan === 'desc') {
      // Sort Kelurahan in descending order
      matchingRows.sort((a, b) => customSort(a.Kelurahan, b.Kelurahan, -1));
    }
  }

  if (sortingUsia !== 'noFilter') {
    if (sortingUsia === 'asc') {
      // Sort Usia in ascending order
      matchingRows.sort((a, b) => customSort(a.Usia, b.Usia, 1));
    } else if (sortingUsia === 'desc') {
      // Sort Usia in descending order
      matchingRows.sort((a, b) => customSort(a.Usia, b.Usia, -1));
    }
  }

  if (sortingRT !== 'noFilter') {
    if (sortingRT === 'asc') {
      // Sort RT in ascending order
      matchingRows.sort((a, b) => customSort(a.RT, b.RT, 1));
    } else if (sortingRT === 'desc') {
      // Sort RT in descending order
      matchingRows.sort((a, b) => customSort(a.RT, b.RT, -1));
    }
  }

  if (sortingRW !== 'noFilter') {
    if (sortingRW === 'asc') {
      // Sort RW in ascending order
      matchingRows.sort((a, b) => customSort(a.RW, b.RW, 1));
    } else if (sortingRW === 'desc') {
      // Sort RW in descending order
      matchingRows.sort((a, b) => customSort(a.RW, b.RW, -1));
    }
  }

  if (sortingTPS !== 'noFilter') {
    if (sortingTPS === 'asc') {
      // Sort TPS in ascending order
      matchingRows.sort((a, b) => customSort(a.TPS, b.TPS, 1));
    } else if (sortingTPS === 'desc') {
      // Sort TPS in descending order
      matchingRows.sort((a, b) => customSort(a.TPS, b.TPS, -1));
    }
  }

  // After sorting, update the table with the sorted data
  updateTable();
});

// Get references to the sorting selects
const sortingNama = document.getElementById('sortingNama');
const sortingJenisKelamin = document.getElementById('sortingJenisKelamin');
const sortingKelurahan = document.getElementById('sortingKelurahan');
const sortingUsia = document.getElementById('sortingUsia');
const sortingRT = document.getElementById('sortingRT');
const sortingRW = document.getElementById('sortingRW');
const sortingTPS = document.getElementById('sortingTPS');

// Function to disable other sorting options when one is selected
function disableOtherSortOptions(selectedOption) {
  const sortingOptions = [sortingNama, sortingJenisKelamin, sortingKelurahan, sortingUsia, sortingRT, sortingRW, sortingTPS];
  sortingOptions.forEach((option) => {
    if (option !== selectedOption) {
      option.disabled = true;
    }
  });
}

// Function to enable all sorting options
function enableAllSortOptions() {
  const sortingOptions = [sortingNama, sortingJenisKelamin, sortingKelurahan, sortingUsia, sortingRT, sortingRW, sortingTPS];
  sortingOptions.forEach((option) => {
    option.disabled = false;
  });
}

// Add a change event listener to each sorting select
sortingNama.addEventListener('change', () => {
  if (sortingNama.value !== 'noFilter') {
    disableOtherSortOptions(sortingNama);
  } else {
    enableAllSortOptions();
  }
});

sortingJenisKelamin.addEventListener('change', () => {
  if (sortingJenisKelamin.value !== 'noFilter') {
    disableOtherSortOptions(sortingJenisKelamin);
  } else {
    enableAllSortOptions();
  }
});

sortingKelurahan.addEventListener('change', () => {
  if (sortingKelurahan.value !== 'noFilter') {
    disableOtherSortOptions(sortingKelurahan);
  } else {
    enableAllSortOptions();
  }
});

sortingUsia.addEventListener('change', () => {
  if (sortingUsia.value !== 'noFilter') {
    disableOtherSortOptions(sortingUsia);
  } else {
    enableAllSortOptions();
  }
});

sortingRT.addEventListener('change', () => {
  if (sortingRT.value !== 'noFilter') {
    disableOtherSortOptions(sortingRT);
  } else {
    enableAllSortOptions();
  }
});

sortingRW.addEventListener('change', () => {
  if (sortingRW.value !== 'noFilter') {
    disableOtherSortOptions(sortingRW);
  } else {
    enableAllSortOptions();
  }
});

sortingTPS.addEventListener('change', () => {
  if (sortingTPS.value !== 'noFilter') {
    disableOtherSortOptions(sortingTPS);
  } else {
    enableAllSortOptions();
  }
});

// Add a click event listener to the Apply Sorting button
applySortingButton.addEventListener('click', () => {
  // Your sorting logic here
});
