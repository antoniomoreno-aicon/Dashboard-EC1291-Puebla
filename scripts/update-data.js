import fs from "fs";
import XLSX from "xlsx";

const EXCEL_FILE = "input/dashboard.xlsx";
const OUTPUT_FILE = "data.json";
const SHEET_NAME = "DASHBOARD";

function cell(sheet, address, fallback = "") {
  return sheet[address]?.v ?? fallback;
}

function getNumber(sheet, address) {
  const value = cell(sheet, address, 0);
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function readRows(sheet, startRow, endRow) {
  const rows = [];

  for (let row = startRow; row <= endRow; row++) {
    const name = cell(sheet, `A${row}`, "");
    const count = getNumber(sheet, `B${row}`);

    if (!name || String(name).toLowerCase().includes("total general")) {
      continue;
    }

    rows.push({
      name: String(name).trim(),
      count
    });
  }

  return rows;
}

function main() {
  if (!fs.existsSync(EXCEL_FILE)) {
    throw new Error(`No encontré el archivo ${EXCEL_FILE}`);
  }

  const workbook = XLSX.readFile(EXCEL_FILE, {
    cellDates: true
  });

  const sheet = workbook.Sheets[SHEET_NAME];

  if (!sheet) {
    throw new Error(`No encontré la hoja ${SHEET_NAME}`);
  }

  const data = {
    lastUpdated: new Date().toISOString(),
    cards: [
      {
        label: "Evaluaciones totales",
        value: getNumber(sheet, "A6")
      },
      {
        label: "Procesos en lotes",
        value: getNumber(sheet, "D6")
      },
      {
        label: "Procesos cargados sin meter en lotes",
        value: getNumber(sheet, "G6")
      },
      {
        label: "Procesos cargados sin meter en lotes 2",
        value: getNumber(sheet, "I6")
      }
    ],
    centros: readRows(sheet, 13, 15),
    evaluadores: readRows(sheet, 30, 50)
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`${OUTPUT_FILE} actualizado correctamente desde ${EXCEL_FILE}`);
}

main();
