const SPREADSHEET_ID = "1vG5anL_U086FCc9zgWEq7lZ9WCs7RoS4sDB3TaQ5LxA";
const SHEET_NAME = "Citas";

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
}
