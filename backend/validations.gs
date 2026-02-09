function validarCita(cita) {
  if (!cita.paciente || !cita.medico || !cita.fecha || !cita.hora) {
    throw new Error("Todos los campos son obligatorios");
  }

  const fechaHoraCita = new Date(cita.fecha + " " + cita.hora);
  if (fechaHoraCita < new Date()) {
    throw new Error("No se permiten citas en fechas pasadas");
  }

  return true;
}

