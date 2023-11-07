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

const XLSX = require('xlsx');

// Function to enable or disable checkboxes based on selection
const toggleCheckboxes = () => {
  const kecamatanDropdown = document.getElementById('kecamatanDropdown');
  const desaDropdown = document.getElementById('desaDropdown');
  const checkboxes = document.querySelectorAll('.form-check-input');

  // Check if both Kecamatan and Desa/Kelurahan are selected
  const kecamatanSelected = kecamatanDropdown.value !== '';
  const desaSelected = desaDropdown.value !== '';

  // Enable or disable checkboxes accordingly
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = !(kecamatanSelected && desaSelected);
  });
};

// Event listeners for Kecamatan and Desa/Kelurahan dropdowns
document.getElementById('kecamatanDropdown').addEventListener('change', toggleCheckboxes);
document.getElementById('desaDropdown').addEventListener('change', toggleCheckboxes);

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

  // Toggle the checkboxes based on the selection
  toggleCheckboxes();
});

// Event listener for the Desa/Kelurahan dropdown change event
document.getElementById('desaDropdown').addEventListener('change', () => {
  const selectedDesa = document.getElementById('desaDropdown').value;

  if (selectedDesa) {
    // Call the function to populate the table data based on the selected "Desa"
    getExcelDataByDesa(selectedDesa);
    selectedDesaKelHeader.textContent = `${selectedDesa}`;
  } else {
    // Clear the table when no "Desa" is selected
    clearTableData();
    selectedDesaKelHeader.textContent = '';
  }
});

// Add a click event listener to the "Rekapitulasi Analisa" link
document.getElementById('rekapitulasiLink').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the link from navigating to a new page

  // Get the selected columns from checkboxes in analisa-data.html
  const checkboxes = document.querySelectorAll('.form-check-input');
  const selectedColumns = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id.toLowerCase());

  // Log the selected columns to the console
  console.log('Selected Columns:', selectedColumns);

  // Check if any columns are selected
  if (selectedColumns.length === 0) {
    alert('Please select at least one column.');
    return;
  }

  // Toggle the visibility of the rekapitulasi section
  const rekapitulasiSection = document.getElementById('rekapitulasi');
  rekapitulasiSection.style.display = 'block'; // Show the section
  const analisaDataSection = document.getElementById('analisa-data');
  analisaDataSection.style.display = 'none';
});

document.getElementById('close-rekapitulasi').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the link from navigating to a new page
  // Uncheck all checkboxes
  const checkboxes = document.querySelectorAll('.form-check-input');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Reset the array of selected columns
  selectedColumns = [];

  // Uncheck all checkboxes and update their class
  for (const column in columnCheckboxes) {
    columnCheckboxes[column].checked = false;
    const tableCells = document.querySelectorAll(`#excelDataTable td[data-column="${column}"]`);
    tableCells.forEach((cell) => {
      cell.classList.add('not-selected');
    });

    // Clear the checkbox state in localStorage
    localStorage.setItem(column, 'unchecked');
  }

  // Toggle the visibility of the rekapitulasi section
  const rekapitulasiSection = document.getElementById('rekapitulasi');
  rekapitulasiSection.style.display = 'none'; // Show the section
  const analisaDataSection = document.getElementById('analisa-data');
  analisaDataSection.style.display = 'block';
});

// Get a reference to the element where you want to display the total count
const totalDataCount = document.querySelector('#totalDataCount');
const totalLakiLakiCount = document.querySelector('#totalLakiLakiCount');
const totalPerempuanCount = document.querySelector('#totalPerempuanCount');
const table = document.querySelector('#excelDataTable');

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

// Function to populate the table with data based on the selected "Desa"
const getExcelDataByDesa = (selectedDesa) => {
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
const excelData = XLSX.utils.sheet_to_json(sheet, { header: ['No.', 'Nama', 'Jenis Kelamin', 'Usia', 'Kelurahan', 'RT', 'RW', 'TPS'] }); // Define headers to match your data

// Filter and display the Excel data where the Kelurahan/Desa matches the selected data
const selectedDesa = document.getElementById('desaDropdown').value; // Get the selected Desa/Kel value

filteredExcelData = excelData.filter((row) => {
  // Assuming 'Kelurahan' is the actual column name for Kelurahan/Desa
  const kelurahanDesa = row['Kelurahan']; // Replace with the correct column name

  // Ensure the Kelurahan/Desa value exists and trim it
  return kelurahanDesa && kelurahanDesa.trim() === selectedDesa.trim();
});

// Display the filtered Excel data in your HTML table
displayExcelData(filteredExcelData, currentPage);

// Save the matchingRows state to local storage
localStorage.setItem('matchingRows', JSON.stringify(matchingRows));

console.log("selected: ", filePath )

          };

          // Read the blob as binary data
          reader.readAsBinaryString(blob);
        })
        .catch((error) => {
          console.error('Error reading Excel file:', error);
        });
    } else {
      console.error('File path not found for selected Desa');
    }
  });
};

// Function to clear the table
const clearTableData = () => {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = ''; // Remove all table rows
};


// Define an object to map column names to checkboxes
const columnCheckboxes = {
  Nama: document.getElementById('namaCheckbox'),
  'Jenis Kelamin': document.getElementById('jeniskelaminCheckbox'),
  'Usia': document.getElementById('usiaCheckbox'),
  'Kelurahan': document.getElementById('kelurahanCheckbox'),
  'RT': document.getElementById('rtCheckbox'),
  'RW': document.getElementById('rwCheckbox'),
  'TPS': document.getElementById('tpsCheckbox'),
};
// Define an array to store selected columns
let selectedColumns = [];

// Add event listeners for each checkbox
for (const column in columnCheckboxes) {
  // Function to handle checkbox state changes
  function handleCheckboxChange() {
    const isChecked = columnCheckboxes[column].checked;

    // Update the array of selected columns
    if (isChecked) {
      selectedColumns.push(column);
    } else {
      // Remove the column from the array if it's unchecked
      selectedColumns = selectedColumns.filter((col) => col !== column);
    }

    // Get all table cells in the selected column
    const tableCells = document.querySelectorAll(`#excelDataTable td[data-column="${column}"]`);

    // Update the class of table cells based on the checkbox state
    tableCells.forEach((cell) => {
      if (isChecked) {
        cell.classList.remove('not-selected');
      } else {
        cell.classList.add('not-selected');
      }
    });

    // Store the checkbox state in localStorage
    localStorage.setItem(column, isChecked ? 'checked' : 'unchecked');

    // Log the selected columns to the console
    console.log('Selected Columns Local Storage:', selectedColumns);
  }

  // Restore checkbox state from localStorage
  const savedState = localStorage.getItem(column);
  if (savedState === 'checked') {
    columnCheckboxes[column].checked = true;
    selectedColumns.push(column); // Add the column to the selectedColumns array
  }

  // Attach the event listener to each checkbox
  columnCheckboxes[column].addEventListener('change', handleCheckboxChange);
}

// Add an event listener to clear the storage when the page is refreshed
window.addEventListener('beforeunload', () => {
  for (const column in columnCheckboxes) {
    localStorage.removeItem(column);
  }
});

// Define global variables to track the current page and rows per page
let currentPage = 1;
let rowsPerPage = 10; // You can change the default value as needed
let matchingRows = []; // Maintain a variable for the matching rows

// Function to display Excel data in the HTML table
function displayExcelData(data, pageNumber) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';

  // Calculate the start and end indices for the current page
  const startIndex = (pageNumber - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);

  // Create an array to store the matching rows
  matchingRows = data.slice(); // Copy the data to matchingRows

  // Iterate through the data for the current page
  for (let i = startIndex; i < endIndex; i++) {
    // Create table rows and append them to the table body
    const row = matchingRows[i]; // Use matchingRows instead of data
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${i + 1}</td>
      <td data-column="Nama" class="not-selected">${row.Nama}</td>
      <td data-column="Jenis Kelamin" class="not-selected">${row['Jenis Kelamin']}</td>
      <td data-column="Usia" class="not-selected">${row.Usia}</td>
      <td data-column="Kelurahan" class="not-selected">${row.Kelurahan}</td>
      <td data-column="RT" class="not-selected">${row.RT}</td>
      <td data-column="RW" class="not-selected">${row.RW}</td>
      <td data-column="TPS" class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  }

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

  updatePaginationUI(pageNumber, matchingRows.length);
}

function updateTable() {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = ''; // Clear the existing table before displaying results

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, matchingRows.length);

  const encounteredNames = {}; // Object to store encountered names
  // Track duplicate names in an array
const duplicateNames = [];
 // Save the state of checkboxes before clearing the table
 for (const column in columnCheckboxes) {
  const checkbox = columnCheckboxes[column];
  localStorage.setItem(column, checkbox.checked ? 'checked' : 'unchecked');
}

  for (let i = startIndex; i < endIndex; i++) {
   // Create table rows and append them to the table body
   const row = matchingRows[i]; // Use matchingRows instead of data
   const tableRow = document.createElement('tr');
   tableRow.innerHTML = `
     <td>${i + 1}</td>
     <td data-column="Nama" class="not-selected">${row.Nama}</td>
     <td data-column="Jenis Kelamin" class="not-selected">${row['Jenis Kelamin']}</td>
     <td data-column="Usia" class="not-selected">${row.Usia}</td>
     <td data-column="Kelurahan" class="not-selected">${row.Kelurahan}</td>
     <td data-column="RT" class="not-selected">${row.RT}</td>
     <td data-column="RW" class="not-selected">${row.RW}</td>
     <td data-column="TPS" class="not-selected">${row.TPS}</td>
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

  // Clear the "not-selected" class from the selected columns
  selectedColumns.forEach((column) => {
    const tableCells = document.querySelectorAll(`#excelDataTable td[data-column="${column}"]`);
    tableCells.forEach((cell) => {
      cell.classList.remove('not-selected');
    });
  })

//   // Clear existing duplicate names
// const duplicateNamesList = document.getElementById('duplicateNamesList');
// duplicateNamesList.innerHTML = '';

// Display the duplicate names in the HTML
duplicateNames.forEach((name) => {
  const listItem = document.createElement('li');
  listItem.textContent = name;
  duplicateNamesList.appendChild(listItem);
})

// // Check if there are duplicate names
// if (duplicateNames.length > 0) {
//   // If there are duplicate names, make the section visible
//   const duplicateNamesSection = document.getElementById('duplicateNamesSection');
//   duplicateNamesSection.style.display = 'block';
// } else {
//   // If there are no duplicate names, hide the section
//   const duplicateNamesSection = document.getElementById('duplicateNamesSection');
//   duplicateNamesSection.style.display = 'none';
// }
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