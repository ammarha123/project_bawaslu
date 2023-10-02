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

// Add a click event listener to each checkbox
const checkboxes = document.querySelectorAll('.form-check-input');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', () => {
    // Uncheck all checkboxes except the clicked one
    checkboxes.forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
    });
  });
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
  // Toggle the checkboxes based on the selection
  toggleCheckboxes();
});


// Add a click event listener to the "namaCheckbox" checkbox
const namaCheckbox = document.getElementById('namaCheckbox');
namaCheckbox.addEventListener('click', () => {
  if (namaCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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

      print(rows, 1)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const jeniskelaminCheckbox = document.getElementById('jeniskelaminCheckbox');
jeniskelaminCheckbox.addEventListener('click', () => {
  if (jeniskelaminCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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

      print(rows, 2)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const usiaCheckbox = document.getElementById('usiaCheckbox');
usiaCheckbox.addEventListener('click', () => {
  if (usiaCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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

      print(rows, 3)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const kelurahanCheckbox = document.getElementById('kelurahanCheckbox');
kelurahanCheckbox.addEventListener('click', () => {
  if (kelurahanCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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

      print(rows, 4)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const rtCheckbox = document.getElementById('rtCheckbox');
rtCheckbox.addEventListener('click', () => {
  if (rtCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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

      print(rows, 5)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const rwCheckbox = document.getElementById('rwCheckbox');
rwCheckbox.addEventListener('click', () => {
  if (rwCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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
      print(rows, 6)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

const tpsCheckbox = document.getElementById('tpsCheckbox');
tpsCheckbox.addEventListener('click', () => {
  if (tpsCheckbox.checked) {
    const selectedDesa = document.getElementById('desaDropdown').value;

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
      print(rows, 7)
    });
  } else {
    // Clear the table when the checkbox is unchecked
    const tableBody = document.querySelector('#excelDataTable');
    tableBody.innerHTML = ''; // Remove all table rows
  }
});

function print(rows, numberData) {
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
          if (numberData == 7) {
            displayExcelData7(excelData);
          }
          if (numberData == 6) {
            displayExcelData6(excelData);
          }
          if (numberData == 5) {
            displayExcelData5(excelData);
          }
          if (numberData == 4) {
            displayExcelData4(excelData);
          }
          if (numberData == 3) {
            displayExcelData3(excelData);
          }
          if (numberData == 2) {
            displayExcelData2(excelData);
          }
          if (numberData == 1) {
            displayExcelData(excelData);
          }
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
}

// Add a click event listener to the "Rekapitulasi Analisa" link
document.getElementById('rekapitulasiLink').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the link from navigating to a new page

  // Get the selected columns from checkboxes in analisa-data.html
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

// Initialize a variable to keep track of the last index
// Function to display Excel data in the HTML table without replacing existing data
function displayExcelData(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td class="not-selected">${row['Jenis Kelamin']}</td>
      <td class="not-selected">${row.Usia}</td>
      <td class="not-selected">${row.Kelurahan}</td>
      <td class="not-selected">${row.RT}</td>
      <td class="not-selected">${row.RW}</td>
      <td class="not-selected">${row.TPS}</td>
    `;

    // Append the new row to the existing table
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData2(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
    <td>${index + 1}</td>
    <td>${row.Nama}</td>
    <td>${row['Jenis Kelamin']}</td>
    <td class="not-selected">${row.Usia}</td>
    <td class="not-selected">${row.Kelurahan}</td>
    <td class="not-selected">${row.RT}</td>
    <td class="not-selected">${row.RW}</td>
    <td class="not-selected">${row.TPS}</td>
    `;

    // Append the new row to the existing table
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData3(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td class="not-selected">${row.Kelurahan}</td>
      <td class="not-selected">${row.RT}</td>
      <td class="not-selected">${row.RW}</td>
      <td class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData4(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kelurahan}</td>
      <td class="not-selected">${row.RT}</td>
      <td class="not-selected">${row.RW}</td>
      <td class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData5(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td class="not-selected">${row.RW}</td>
      <td class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData6(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td>${row.RW}</td>
      <td class="not-selected">${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}

function displayExcelData7(data) {
  const tableBody = document.querySelector('#excelDataTable');
  tableBody.innerHTML = '';
  // Iterate through the Excel data and create table rows
  data.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Nama}</td>
      <td>${row['Jenis Kelamin']}</td>
      <td>${row.Usia}</td>
      <td>${row.Kelurahan}</td>
      <td>${row.RT}</td>
      <td>${row.RW}</td>
      <td>${row.TPS}</td>
    `;
    tableBody.appendChild(tableRow);
  });
}