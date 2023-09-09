// Inside rekapitulasi.js

// Event listener for the rekapitulasiLink click event
document.getElementById('rekapitulasiLink').addEventListener('click', (event) => {
    // Prevent the default link behavior (to avoid navigating away)
    event.preventDefault();
  
    // Retrieve the shared data from the other page
    const excelData = window.sharedExcelData;
  
    // Check if data exists
    if (excelData) {
      // Display the data in the table on rekapitulasi.html
      displayExcelData(excelData);
    } else {
      console.error('Data not available.');
    }
  });
  
  // Function to display Excel data in the HTML table without replacing existing data
  function displayExcelData(data) {
    const tableBody = document.querySelector('#excelDataTable');
    // Clear existing table data
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
  
      // Append the new row to the table
      tableBody.appendChild(tableRow);
    });
  }
  