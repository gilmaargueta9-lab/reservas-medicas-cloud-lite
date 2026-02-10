function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Reservas Médicas CISS");
}
