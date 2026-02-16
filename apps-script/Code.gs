/**********************************
 * WEB APP
 **********************************/
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("Reservas Médicas CISS");
}

/**********************************
 * CONEXIÓN A SHEET
 **********************************/
function getSheet() {
  const sh = SpreadsheetApp.getActive().getSheetByName("citas");
  if (!sh) throw new Error("No existe la hoja 'citas'");
  return sh;
}

/**********************************
 * GUARDAR / REPROGRAMAR CITA
 **********************************/
function guardarOActualizarCita(cita) {

  if (
    !cita ||
    !cita.paciente?.trim() ||
    !cita.medico?.trim() ||
    !cita.fecha ||
    !cita.hora ||
    !cita.telefono?.trim()
  ) {
    throw new Error("⚠️ Todos los campos son obligatorios");
  }

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  data.shift(); // eliminar cabecera

  const fechaNueva = cita.fecha;                 
  const horaNueva  = normalizarHora(cita.hora);  
  const medicoNuevo = cita.medico.toLowerCase().trim();

  for (let i = 0; i < data.length; i++) {

    if (cita.indice !== null && i === Number(cita.indice)) continue;

    const fechaBD = data[i][2] instanceof Date
      ? Utilities.formatDate(data[i][2], Session.getScriptTimeZone(), "yyyy-MM-dd")
      : data[i][2];

    const horaBD = normalizarHora(data[i][3]);
    const medicoBD = data[i][4].toString().toLowerCase().trim();
    const estadoBD = data[i][7];

    if (
      estadoBD === "Programada" &&
      fechaBD === fechaNueva &&
      horaBD === horaNueva &&
      medicoBD === medicoNuevo
    ) {
      throw new Error(
        `🚫 El Dr. ${cita.medico} ya tiene una cita el ${fechaNueva} a las ${horaNueva}`
      );
    }
  }

  if (cita.indice !== null && cita.indice !== undefined) {
    const fila = Number(cita.indice) + 2;
    sheet.getRange(fila, 3, 1, 5).setValues([[
      fechaNueva,
      horaNueva,
      cita.medico,
      cita.paciente,
      cita.telefono
    ]]);
    return "✏️ Cita modificada correctamente";
  }

  const idCita = generarId();

  sheet.appendRow([
    idCita,         
    new Date(),     
    fechaNueva,    
    horaNueva,       
    cita.medico,
    cita.paciente,
    cita.telefono,
    "Programada"
  ]);

  return "✅ Cita registrada correctamente. ID: " + idCita;
}

/**********************************
 * BUSCAR CITAS
 **********************************/
function obtenerCitasFiltradas(f) {

  const data = getSheet().getDataRange().getValues();
  data.shift();

  return data.map((r, i) => {

    const fechaRaw = r[2] instanceof Date
      ? Utilities.formatDate(r[2], Session.getScriptTimeZone(), "yyyy-MM-dd")
      : r[2];

    return {
      fechaRaw,
      fecha: Utilities.formatDate(new Date(fechaRaw), Session.getScriptTimeZone(), "dd/MM/yyyy"),
      hora: normalizarHora(r[3]),
      medico: r[4],
      paciente: r[5],
      telefono: r[6],
      estado: r[7],
      indiceOriginal: i
    };

  }).filter(c =>
    c.estado === "Programada" &&
    (!f.fecha || c.fechaRaw === f.fecha) &&
    (
      !f.texto ||
      c.medico.toLowerCase().includes(f.texto.toLowerCase()) ||
      c.paciente.toLowerCase().includes(f.texto.toLowerCase())
    )
  );
}

/**********************************
 * CANCELAR CITA
 **********************************/
function cancelarCitaServidor(i) {
  getSheet().getRange(Number(i) + 2, 8).setValue("Cancelada");
  return "❌ Cita cancelada correctamente";
}

/**********************************
 * UTILIDADES
 **********************************/
function normalizarHora(h) {
  if (!h) return "";

  // Si viene como Date
  if (h instanceof Date) {
    return Utilities.formatDate(
      h,
      Session.getScriptTimeZone(),
      "HH:mm"
    );
  }

  return h.toString().substring(0, 5);
}

function generarId() {
  const f = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "CITA-" + f + "-" + r;
}
