const SPREADSHEET_ID = "1vG5anL_U086FCc9zgWEq7lZ9WCs7RoS4sDB3TaQ5LxA";
const SHEET_NAME = "citas";

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("No existe la hoja 'citas'");
  return sheet;
}
