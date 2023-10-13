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

  if (selectedKecamatan) {
    // Call the function to populate the Desa/Kel dropdown
    getDesaByKecamatan(selectedKecamatan);
  } else {
    // Clear the Desa/Kel dropdown if no Kecamatan is selected
    const desaDropdown = document.getElementById('desaDropdown');
    desaDropdown.innerHTML = '<option value="">Select Desa/Kel</option>';
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
  } else {
    // Clear the table when no "Desa" is selected
    clearTableData();
  }
});

// Function to populate the table with data based on the selected "Desa"
const getExcelDataByDesa = (selectedDesa) => {
  // Define the file path based on the selected "Desa"
  let filePath = '';

  // Construct the SQL query to fetch the file path for the selected "Desa"
  const sql = `SELECT file FROM desa WHERE name = ?`;

  // Query your database to get the file path
  dbConnection.query(sql, [selectedDesa], (err, rows) => {
    if (err) {
      console.error('Error fetching file path:', err);
      return;
    }

    // Assuming you have only one file path per "Desa"
    if (rows.length > 0) {
      const fileRow = rows[0];
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
      console.error('File path not found for selected Desa');
    }
  });
};

// Function to clear the table
const clearTableData = () => {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = ''; // Remove all table rows
};

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
  // Toggle the visibility of the rekapitulasi section
  const rekapitulasiSection = document.getElementById('rekapitulasi');
  rekapitulasiSection.style.display = 'none'; // Show the section
  const analisaDataSection = document.getElementById('analisa-data');
  analisaDataSection.style.display = 'block';
});


// Define an object to map column names to checkboxes
const columnCheckboxes = {
  Nama: document.getElementById('namaCheckbox'),
  'Jenis Kelamin': document.getElementById('jeniskelaminCheckbox'),
  'Usia': document.getElementById('usiaCheckbox'),
  'Kelurahan': document.getElementById('kelurahanCheckbox'),
  'RT': document.getElementById('rtCheckbox'),
  'RW': document.getElementById('rwCheckbox'),
  'TPS': document.getElementById('tpsCheckbox'),
  // Add other column checkboxes here
};

// Add event listeners for each checkbox
for (const column in columnCheckboxes) {
  columnCheckboxes[column].addEventListener('click', () => {
    const isChecked = columnCheckboxes[column].checked;
    const selectedColumn = columnCheckboxes[column].getAttribute('data-column');

    // Get all table cells in the selected column
    const tableCells = document.querySelectorAll(`#excelDataTable td[data-column="${selectedColumn}"]`);

    // Update the class of table cells based on the checkbox state
    tableCells.forEach((cell) => {
      if (isChecked) {
        cell.classList.remove('not-selected');
      } else {
        cell.classList.add('not-selected');
      }
    });
  });
}

// Function to display Excel data in the HTML table
function displayExcelData(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    // Add "data-column" attributes to table cells for mapping to checkboxes
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td data-column="Nama" class="not-selected">${row.Nama}</td>
      <td data-column="Jenis Kelamin" class="not-selected">${row['Jenis Kelamin']}</td>
      <td data-column="Usia" class="not-selected">${row.Usia}</td>
      <td data-column="Kelurahan" class="not-selected">${row.Kelurahan}</td>
      <td data-column="RT" class="not-selected">${row.RT}</td>
      <td data-column="RW" class="not-selected">${row.RW}</td>
      <td data-column="TPS" class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}