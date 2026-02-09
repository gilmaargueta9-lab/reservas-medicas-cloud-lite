function listarCitas() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  Logger.log(data);
  return data;
}
