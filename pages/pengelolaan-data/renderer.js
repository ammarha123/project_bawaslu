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
    };

    // Read the file as binary data
    reader.readAsBinaryString(selectedFile);
  }
});

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
    } else {
      row.classList.remove('selected-row');
    }
  });
}

// Event delegation for row selection
document.querySelector('#excelDataTable').addEventListener('click', (event) => {
  if (event.target.tagName === 'TD') {
    const rowIndex = event.target.parentElement.rowIndex - 1; // Subtract 1 for header row
    toggleRowSelection(rowIndex);
  }
});

// Event listener for the "Delete Selected" button
deleteSelectedButton.addEventListener('click', () => {
  // Delete selected rows
  const table = document.querySelector('#excelDataTable');
  const tableRows = Array.from(table.querySelectorAll('tr'));

  // Remove rows in reverse order to avoid shifting indices
  const selectedIndices = Array.from(selectedRows);
  selectedIndices.sort((a, b) => b - a);

  selectedIndices.forEach((index) => {
    table.deleteRow(index);
    selectedRows.delete(index);
  });

  // After deleting rows, update row styles
  updateRowStyles();
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
  });
}

// Function to update the total data count
function updateTotalDataCount() {
  // Get the total number of rows in the table (excluding the header)
  const rowCount = table.rows.length; // Subtract 1 for the header row

  // Update the content of the totalDataCount element
  totalDataCount.textContent = `ea ${rowCount}`;
}

// Initialize variables to count the number of Perempuan and Laki-laki
let totalPerempuan = 0;
let totalLakiLaki = 0;

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

  console.log(totalLakiLaki)
  // Update the content of the totalPerempuanCount and totalLakiLakiCount elements
  totalPerempuanCount.textContent = `${totalPerempuan}`;
  totalLakiLakiCount.textContent = `${totalLakiLaki}`;
}

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

