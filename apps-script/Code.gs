function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Sistema de Reservas Médicas')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("citas");
  if (!sheet) throw new Error("No se encontró la pestaña 'citas'");
  return sheet;
}

function obtenerCitasFiltradas(filtro) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    data.shift(); 

    const fechaBusqueda = filtro.fecha || ""; 
    const textoBusqueda = filtro.texto ? filtro.texto.toLowerCase().trim() : "";

    return data.map((fila, index) => {
      if (!fila[0]) return null;
      
      let fechaBD = "";
      if (fila[2] instanceof Date) {
        fechaBD = Utilities.formatDate(fila[2], Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        fechaBD = fila[2].toString();
      }

      return {
        fecha: fechaBD,
        hora: fila[3] ? fila[3].toString() : "",
        medico: fila[4] ? fila[4].toString() : "",
        paciente: fila[5] ? fila[5].toString() : "",
        telefono: fila[6] ? fila[6].toString() : "", 
        estado: fila[7] ? fila[7].toString() : "",
        indiceOriginal: index 
      };
    }).filter(cita => {
      if (!cita || cita.estado !== "Programada") return false;
      
      let cumpleFecha = !fechaBusqueda || (cita.fecha === fechaBusqueda);
      // Busca el texto tanto en Médico como en Paciente para mayor flexibilidad
      let cumpleTexto = !textoBusqueda || (
        cita.medico.toLowerCase().includes(textoBusqueda) || 
        cita.paciente.toLowerCase().includes(textoBusqueda)
      );
      
      return cumpleFecha && cumpleTexto;
    });
  } catch (e) {
    return [];
  }
}

function guardarOActualizarCita(cita) {
  try {
    const sheet = getSheet();
    const estado = "Programada";

    if (cita.indice !== null && cita.indice !== undefined) {
      const fila = Number(cita.indice) + 2;
      sheet.getRange(fila, 3).setValue(cita.fecha);
      sheet.getRange(fila, 4).setValue(cita.hora);
      sheet.getRange(fila, 5).setValue(cita.medico);
      sheet.getRange(fila, 6).setValue(cita.paciente);
      sheet.getRange(fila, 7).setValue(cita.telefono);
      return "Cita actualizada correctamente";
    }

    const idCita = generarIdCita();
    sheet.appendRow([idCita, new Date(), cita.fecha, cita.hora, cita.medico, cita.paciente, cita.telefono, estado]);
    return "Cita guardada correctamente. ID: " + idCita;
  } catch (e) {
    return "Error: " + e.toString();
  }
}

function cancelarCita(indexOriginal) {
  const sheet = getSheet();
  const fila = Number(indexOriginal) + 2; 
  sheet.getRange(fila, 8).setValue("Cancelada");
  return "Cita cancelada correctamente.";
}

function generarIdCita() {
  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "CITA-" + fecha + "-" + random;
}
