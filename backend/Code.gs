function listarCitas() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  Logger.log(data);
  return data;
}
function guardarCita(cita) {
  validarCita(cita);

  const sheet = getSheet();
  sheet.appendRow([
    new Date(),
    cita.fecha,
    cita.hora,
    cita.medico,
    cita.paciente,
    "Programada"
  ]);

  return "Cita registrada correctamente";
}
