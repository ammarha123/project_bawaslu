const generateWorkbook = () => {
    const Excel = require('exceljs');

    return new Excel.Workbook();
}