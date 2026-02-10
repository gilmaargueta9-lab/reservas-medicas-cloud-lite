function validarCita(cita) {
  if (!cita.paciente || !cita.medico || !cita.fecha || !cita.hora) {
    throw new Error("Todos los campos son obligatorios");
  }

  const fechaHora = new Date(cita.fecha + " " + cita.hora);
  if (fechaHora < new Date()) {
    throw new Error("No se permiten citas en fechas pasadas");
  }
}

function validarSolapamiento(cita) {
  const data = getSheet().getDataRange().getValues();
  data.shift();

  const conflicto = data.some(row =>
    row[1] === cita.fecha &&
    row[2] === cita.hora &&
    row[3] === cita.medico &&
    row[6] === "Programada"
  );

  if (conflicto) {
    throw new Error("Horario no disponible para este médico");
  }
}

