/**************************************
 * VALIDATIONS.GS – VALIDACIONES
 **************************************/

function validarCita(cita) {
  if (!cita) throw new Error("No se recibieron datos.");

  if (
    !cita.paciente?.trim() ||
    !cita.medico?.trim() ||
    !cita.fecha ||
    !cita.hora?.trim() ||
    !cita.telefono?.trim()
  ) {
    throw new Error("⚠️ Todos los campos son obligatorios.");
  }

  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const fechaCita = new Date(cita.fecha + "T00:00:00");
  if (fechaCita < hoy) {
    throw new Error("⚠️ No se permiten citas en fechas pasadas.");
  }
}

function validarSolapamiento(cita, indiceActual = null) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  data.shift();

  for (let i = 0; i < data.length; i++) {
    if (indiceActual !== null && i === Number(indiceActual)) continue;

    const fechaFila = data[i][2] instanceof Date
      ? Utilities.formatDate(data[i][2], Session.getScriptTimeZone(), "yyyy-MM-dd")
      : data[i][2];

    const horaFila = data[i][3] instanceof Date
      ? Utilities.formatDate(data[i][3], Session.getScriptTimeZone(), "HH:mm")
      : data[i][3].substring(0,5);

    const medicoFila = data[i][4].toLowerCase().trim();
    const estadoFila = data[i][7];

    if (
      estadoFila === "Programada" &&
      fechaFila === cita.fecha &&
      horaFila === cita.hora &&
      medicoFila === cita.medico.toLowerCase().trim()
    ) {
      throw new Error("🚫 El médico ya tiene una cita en ese horario.");
    }
  }
}

function generarIdCita() {
  return "CITA-" +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") +
    "-" +
    Math.random().toString(36).substring(2,6).toUpperCase();
}
