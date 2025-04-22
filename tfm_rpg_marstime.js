const marsMonths = [
  { name: "Orion", sols: 28 },      // Der Jaeger – bekannteste Winterkonstellation
  { name: "Sirius", sols: 27 },     // Hellster Stern, im "Grossen Hund"
  { name: "Vega", sols: 28 },       // Hauptstern in der Leier, Teil des Sommerdreiecks
  { name: "Lyra", sols: 27 },       // Die Leier – kleines, aber markantes Sternbild
  { name: "Cygnus", sols: 28 },     // Der Schwan – kreuzt die Milchstraße
  { name: "Altair", sols: 27 },     // Hauptstern in Aquila (Adler), Sommerdreieck
  { name: "Andromeda", sols: 28 },  // Galaxien-Namensgeberin und Sternbild
  { name: "Perseus", sols: 27 },    // Held der griechischen Mythologie
  { name: "Aldebaran", sols: 28 },  // Roter Riese im Stier – „Auge des Stiers“
  { name: "Taurus", sols: 27 },     // Das Sternbild Stier
  { name: "Castor", sols: 28 },     // Einer der Zwillinge (Gemini)
  { name: "Pollux", sols: 27 },     // Der andere Zwilling
  { name: "Regulus", sols: 28 },    // Hauptstern im Loewen
  { name: "Leo", sols: 27 },        // Das Sternbild Loewe
  { name: "Spica", sols: 28 },      // Hauptstern der Jungfrau
  { name: "Virgo", sols: 27 },      // Die Jungfrau
  { name: "Antares", sols: 28 },    // Roter Riese im Skorpion
  { name: "Scorpio", sols: 27 },    // Das Sternbild Skorpion
  { name: "Betelgeuse", sols: 28 }, // Schulterstern in Orion – baldige Supernova
  { name: "Canopus", sols: 27 },    // Zweithellster Stern, Navigation auf See
  { name: "Arcturus", sols: 28 },   // Heller Roter Riese in Bootes
  { name: "Deneb", sols: 27 },      // Schwaenzchen des Schwans – Teil des Sommerdreiecks
  { name: "Capella", sols: 28 },    // In Auriga (Fuhrmann), einer der hellsten
  { name: "Procyon", sols: 27 }     // In Canis Minor – mit Sirius und Betelgeuse ein Winterdreieck
];

let solBaseDate = new Date(Date.UTC(2000, 0, 6)); // Standardwert: 6. Jan 2000

// Kalender Konverter Erde -> Mars
function convertEarthToMarsSimple() {
  const input = document.getElementById("earthDateTime").value;
  if (!input) return;

   const date = getUTCDateFromLocalInput(input); // garantiert UTC, keine Zeitzonenprobleme
  
  // Gültigkeitsprüfung
  const jd = getJulianDate(date); // neue, präzise Funktion
  if (isNaN(jd) || jd < 2451549.5) {
    document.getElementById("marsResultSimple").innerText = "No dates earlier than January 6th, 2000 00:00:00 UTC allowed.";
    return;
  }

  console.log("UTC input:", date.toISOString());
  console.log("Julian Date:", jd);
  console.log("MSD:", getMSD(date));
  console.log("MTC:", getMTC(date));

  const marsDate = getMarsDateFromUTC(date);
  const marsTime = getMTC(date);

  const resultStr = `Mars date & time: ${marsDate.day}. ${marsDate.month} ${marsDate.year} – ${marsTime} MTC`;
  document.getElementById("marsResultSimple").innerText = resultStr;
}

function getUTCDateFromLocalInput(inputStr) {
  const [datePart, timePart] = inputStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

// Julian Date berechnen
function getJulianDate(date) {
  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1;
  const D = date.getUTCDate();
  const H = date.getUTCHours();
  const Min = date.getUTCMinutes();
  const S = date.getUTCSeconds();

  const dayFraction = (H + (Min + S / 60) / 60) / 24;

  let y = Y;
  let m = M;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (y + 4716))
           + Math.floor(30.6001 * (m + 1))
           + D + dayFraction + B - 1524.5;

  return JD;
}

// MSD-Berechnung nach eigenem Bezugspunkt:
// ----------------------------------------
// Aktuell basiert die Mars-Zeit-Berechnung auf folgendem Referenzdatum:
//   MSD 44796.0 = JD 2451549.5 = 06. Januar 2000, 00:00 UTC
// Dies ist nicht NASA-konform, aber intern konsistent und exakt synchron
// mit dem eigenen Kalender: 1. Orion 1 – 00:00 MTC.
//
// Um NASA-kompatibel zu rechnen, müsste die MSD-Funktion stattdessen:
//
//   - Den offiziellen Julian-Date-Offset der NASA verwenden:
//       JD_REF = 2405522.0028779  // entspricht: 1873-12-29 12:00 UTC
//   - Und folgende Formel nutzen:
//       MSD = (JD - JD_REF) / 1.0274912517
//
// Dadurch ergibt sich für:
//   JD 2451550.0 (06. Jan 2000, 12:00 UTC) → MSD 44796.0
//
// ➤ Für spätere Umstellung einfach die MSD-Funktion anpassen.
// ----------------------------------------
// function getMSD(date) {
//  const jd = getJulianDate(date);
//  return (jd - 2405522.0028779) / 1.0274912517;
// }
// ----------------------------------------
/* function getMSD(date) {
  const jd = getJulianDate(date);
  return (jd - 2451549.5) / 1.0274912517 + 44796.0;
} */

function getMSD(date = new Date()) {
  const jd = getJulianDate(date);
  const useNasa = document.getElementById("useNasaMode")?.checked;

  if (useNasa) {
    return (jd - 2405522.0028779) / 1.0274912517;
  } else {
    return (jd - 2451549.5) / 1.0274912517 + 44796.0;
  }
}

// MTC als String HH:MM:SS
function getMTC(date = new Date()) {
  const msd = getMSD(date);
  const mtcFloat = (msd % 1) * 24;
  const hours = Math.floor(mtcFloat);
  const minutes = Math.floor((mtcFloat % 1) * 60);
  const seconds = Math.floor((((mtcFloat % 1) * 60) % 1) * 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateReferenceInfo() {
  const checked = document.getElementById("useNasaMode").checked;
  const refNote = document.getElementById("referenceNote");
  if (checked) {
    refNote.innerText =
      "Using NASA Mars epoch: 06.01.2000 12:00 UTC → JD 2451550.0 → MSD 44796.0";
  } else {
    refNote.innerText =
      "Using custom Mars epoch: 06.01.2000 00:00 UTC → JD 2451549.5 → MSD 44796.0";
  }

  // Optional: aktuelle Uhr sofort aktualisieren
  updateLiveClocks?.();
}

function pad(n) {
    return String(n).padStart(2, "0");
  }
  
function earthToMarsTime(hours, minutes, seconds) {
  const totalEarthSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const marsSeconds = totalEarthSeconds / 1.02749125;

  const marsHours = Math.floor(marsSeconds / 3600) % 24;
  const marsMinutes = Math.floor((marsSeconds % 3600) / 60);
  const marsFinalSeconds = Math.floor(marsSeconds % 60);

  return `${pad(marsHours)}:${pad(marsMinutes)}:${pad(marsFinalSeconds)}`;
}

function convertTime() {
  const timeInput = document.getElementById("earthTime").value;
  if (!timeInput) return;
  const [h, m, s] = timeInput.split(":").map(Number);
  const mtc = earthToMarsTime(h, m, s || 0);
  document.getElementById("convertedTime").innerText = `Mars Time (MTC): ${mtc}`;
}

// MTC Live Clock Update
function updateLiveClocks() {
  const now = new Date();

  // Format Earth date as "16. April 2025"
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const earthDateFormatted = `${now.getUTCDate()}. ${months[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
  const utcTimeStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  document.getElementById("utcDate").innerText = earthDateFormatted;
  document.getElementById("utcClock").innerText = utcTimeStr;

  // Marszeit
  const mtcTimeStr = getMTC(now);
  document.getElementById("mtcClock").innerText = mtcTimeStr;

  const marsDate = getMarsDateFromUTC(now);
  document.getElementById("marsDate").innerText = `${marsDate.day}. ${marsDate.month} ${marsDate.year}`;
}

// UTC ➞ MTC Button-Konverter
function convertTime() {
  const input = document.getElementById("earthTime").value;
  if (!input) return;
  const [h, m, s] = input.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(h, m, s || 0, 0);
  const mtc = getMTC(date);
  document.getElementById("convertedTime").innerText = `Mars Time (MTC): ${mtc}`;
}

// MTC ➞ UTC Konverter (ungefähre Rückrechnung)
function convertMTCtoUTC() {
  const input = document.getElementById("marsTime").value;
  if (!input) return;
  const [mh, mm, ms] = input.split(":").map(Number);
  const now = new Date();
  const msdToday = getMSD(now);
  const currentSol = Math.floor(msdToday);
  const mtcFraction = (mh + mm / 60 + ms / 3600) / 24;
  const targetMSD = currentSol + mtcFraction;

  const jd = targetMSD * 1.02749125 + 2405522.0028779;
  const unixTime = (jd - 2440587.5) * 86400000;
  const utcDate = new Date(unixTime);

  const utcStr = `${pad(utcDate.getUTCHours())}:${pad(utcDate.getUTCMinutes())}:${pad(utcDate.getUTCSeconds())}`;
  document.getElementById("convertedUTC").innerText = `Earth Time (UTC): ${utcStr}`;
}

function updateSolCounter() {
  const now = new Date();
  const diffSeconds = (now - solBaseDate) / 1000;
  const sols = diffSeconds / 88775.244;
  document.getElementById("solCount").innerText = sols.toFixed(4);
}

function updateSolBase() {
  const input = document.getElementById("solStartDate").value;
  if (!input) return;
  const [year, month, day] = input.split("-").map(Number);
  solBaseDate = new Date(Date.UTC(year, month - 1, day));
  updateSolCounter();
}

// Sols zwischen Datum und Mars-Epoche (MSD 44796.0 = 1. Orion 0001)
function getSolCountSinceEpoch(date = new Date()) {
  const msd = getMSD(date);
  return Math.floor(msd - 44796); // 6. Jan 2000 = Sol 0
}

// Schaltjahrregel: jedes 10. Marsjahr = +1 Sol
function isLeapMarsYear(year) {
  return year % 10 === 0;
}

function getMarsDateFromUTC(date = new Date()) {
  let solsSinceEpoch = getSolCountSinceEpoch(date);

  // Jahr berechnen
  let year = 1;
  while (true) {
    let yearLength = 668 + (isLeapMarsYear(year) ? 1 : 0);
    if (solsSinceEpoch < yearLength) break;
    solsSinceEpoch -= yearLength;
    year++;
  }

  // Monat und Tag berechnen
  let monthIndex = 0;
  while (solsSinceEpoch >= marsMonths[monthIndex].sols) {
    solsSinceEpoch -= marsMonths[monthIndex].sols;
    monthIndex++;
  }

  const month = marsMonths[monthIndex].name;
  const day = solsSinceEpoch + 1;

  return { year, month, day };
}

// Live-Anzeige
function updateMarsDateDisplay() {
  const target = document.getElementById("marsDate");
  if (!target) return;

  const now = new Date();
  const marsDate = getMarsDateFromUTC(now, true);

  const dateString = `${marsDate.day}. ${marsDate.month} ${marsDate.year}`;
  target.innerText = dateString;
}

// Konverter Erddatum -> Marsdatum
function convertEarthDateToMars() {
  const input = document.getElementById("earthDateInput").value;
  const date = new Date(input);
  if (isNaN(date)) {
    document.getElementById("marsDateConverted").innerText = "Ungültiges Datum";
    return;
  }
  const marsDate = getMarsDateFromUTC(date);
  document.getElementById("marsDateConverted").innerText =
    `Marsdatum: ${marsDate.day}. ${marsDate.month} ${marsDate.year}`;
}

// Funktion für Visual Mars Clock (24 Stunden Modus)
/* 
function drawMarsClock() {
  const canvas = document.getElementById("marsClock");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const now = new Date();
  const msd = getMSD(now);
  if (!msd || isNaN(msd)) return;

  const mtcFloat = (msd % 1) * 24;
  const hours = mtcFloat;
  const minutes = (hours % 1) * 60;
  const seconds = (minutes % 1) * 60;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 10;

  // Hintergrundring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ff4500";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Stundenmarkierungen (24)
  ctx.fillStyle = "#ffa500";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius - 15);
    const y = cy + Math.sin(angle) * (radius - 15);
    ctx.fillText(i.toString(), x, y);
  }

  // Label hinzufügen
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = "#ffa500";
  ctx.fillText("MTC", cx, cy - radius + 30);

  // Zeiger zeichnen
  const drawHand = (angle, length, color, width) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(angle - Math.PI / 2) * length,
      cy + Math.sin(angle - Math.PI / 2) * length
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  drawHand((hours / 24) * 2 * Math.PI, radius * 0.5, "#ff6347", 4); // Stunden
  drawHand((minutes / 60) * 2 * Math.PI, radius * 0.7, "#ffa07a", 2); // Minuten
  drawHand((seconds / 60) * 2 * Math.PI, radius * 0.85, "#f0e68c", 1); // Sekunden

  // Marsdatum in die Mitte schreiben
  const marsDate = getMarsDateFromUTC(now);
  ctx.fillStyle = "#ff6347";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`${marsDate.day}. ${marsDate.month}`, cx, cy + 12);
  ctx.font = "12px sans-serif";
  ctx.fillText(`${marsDate.year}`, cx, cy + 28);
}
*/

// Funktion für Visual Mars Clock (12 Stunden Modus)
function drawMarsClock() {
  const canvas = document.getElementById("marsClock");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const now = new Date();
  const msd = getMSD(now);
  if (!msd || isNaN(msd)) return;

  const mtcFloat = (msd % 1) * 24;
  const mtcHours = Math.floor(mtcFloat);
  const mtcMinutes = Math.floor((mtcFloat % 1) * 60);
  const mtcSeconds = Math.floor((((mtcFloat % 1) * 60) % 1) * 60);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 10;

  // Hintergrundring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ff4500";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Stundenmarkierungen (1 bis 12)
  ctx.fillStyle = "#ffa500";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius - 15);
    const y = cy + Math.sin(angle) * (radius - 15);
    ctx.fillText(i.toString(), x, y);
  }

  // Label "MTC"
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = "#ffa500";
  ctx.fillText("MTC", cx, cy - radius + 30);

  // AM/PM Anzeige (zwischen Mittelpunkt und "3")
  const ampm = mtcHours >= 12 ? "PM" : "AM";
  const ampmX = cx + radius * 0.6;
  const ampmY = cy;
  ctx.fillStyle = "#ffcc99";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(ampm, ampmX, ampmY);

  // Zeiger
  const hour = mtcHours % 12 || 12;
  drawHand((hour / 12) * 2 * Math.PI, radius * 0.5, "#ff6347", 4, ctx, cx, cy);
  drawHand((mtcMinutes / 60) * 2 * Math.PI, radius * 0.7, "#ffa07a", 2, ctx, cx, cy);
  drawHand((mtcSeconds / 60) * 2 * Math.PI, radius * 0.85, "#f0e68c", 1, ctx, cx, cy);

  // Marsdatum in die Mitte schreiben
  const marsDate = getMarsDateFromUTC(now);
  ctx.fillStyle = "#ff6347";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`${marsDate.day}. ${marsDate.month}`, cx, cy + 12);
  ctx.font = "12px sans-serif";
  ctx.fillText(`${marsDate.year}`, cx, cy + 28);
}

// Funktion für Visual Earth Clock (24 Stunden Modus)
/* 
function drawEarthClock() {
  const canvas = document.getElementById("earthClock");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const now = new Date();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const seconds = now.getUTCSeconds();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 10;

  // Hintergrundring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#3399ff";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Stundenmarkierungen (24)
  ctx.fillStyle = "#00ff66";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius - 15);
    const y = cy + Math.sin(angle) * (radius - 15);
    ctx.fillText(i.toString(), x, y);
  }

  // Label hinzufügen
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = "#00ff66";
  ctx.fillText("UTC", cx, cy - radius + 30);

  // Zeiger zeichnen
  const drawHand = (angle, length, color, width) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(angle - Math.PI / 2) * length,
      cy + Math.sin(angle - Math.PI / 2) * length
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  drawHand((hours / 24) * 2 * Math.PI, radius * 0.5, "#3399ff", 4); // Stunden
  drawHand((minutes / 60) * 2 * Math.PI, radius * 0.7, "#66ccff", 2); // Minuten
  drawHand((seconds / 60) * 2 * Math.PI, radius * 0.85, "#aaddff", 1); // Sekunden

  // Erd-Datum in die Mitte schreiben
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const day = now.getUTCDate();
  const month = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();

  ctx.fillStyle = "#3399ff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`${day}. ${month}`, cx, cy + 12);
  ctx.font = "12px sans-serif";
  ctx.fillText(`${year}`, cx, cy + 28);
}
*/ 

// Funktion für Visual Earth Clock (12 Stunden Modus)
function drawEarthClock() {
  const canvas = document.getElementById("earthClock");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const now = new Date();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const seconds = now.getUTCSeconds();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 10;

  // Hintergrundring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#3399ff";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Stundenmarkierungen (1 bis 12)
  ctx.fillStyle = "#00ff66";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius - 15);
    const y = cy + Math.sin(angle) * (radius - 15);
    ctx.fillText(i.toString(), x, y);
  }

  // Label "UTC"
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = "#00ff66";
  ctx.fillText("UTC", cx, cy - radius + 30);

  // AM/PM Anzeige (zwischen Mittelpunkt und "3")
  const ampm = hours >= 12 ? "PM" : "AM";
  const ampmX = cx + radius * 0.6;
  const ampmY = cy;
  ctx.fillStyle = "#66ccff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(ampm, ampmX, ampmY);

  // Zeiger
  const hour = hours % 12 || 12;
  drawHand((hour / 12) * 2 * Math.PI, radius * 0.5, "#3399ff", 4, ctx, cx, cy);
  drawHand((minutes / 60) * 2 * Math.PI, radius * 0.7, "#66ccff", 2, ctx, cx, cy);
  drawHand((seconds / 60) * 2 * Math.PI, radius * 0.85, "#aaddff", 1, ctx, cx, cy);

  // Erd-Datum in die Mitte schreiben
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const day = now.getUTCDate();
  const month = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();

  ctx.fillStyle = "#3399ff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`${day}. ${month}`, cx, cy + 12);
  ctx.font = "12px sans-serif";
  ctx.fillText(`${year}`, cx, cy + 28);
}

// Hilfsfunktion fuer Zeiger
function drawHand(angle, length, color, width, ctx, cx, cy) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + Math.cos(angle - Math.PI / 2) * length,
    cy + Math.sin(angle - Math.PI / 2) * length
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function updateDigitalClocks() {
  const now = new Date();

  // Earth
  const utc = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni",
                  "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const earthDate = `${now.getUTCDate()}. ${months[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
  document.getElementById("earthClockDigital").innerText = utc;
  document.getElementById("earthDateDigital").innerText = earthDate;

  // Mars
  const mtc = getMTC(now);
  const marsDate = getMarsDateFromUTC(now);
  const marsDateStr = `${marsDate.day}. ${marsDate.month} ${marsDate.year}`;
  document.getElementById("marsClockDigital").innerText = mtc;
  document.getElementById("marsDateDigital").innerText = marsDateStr;
}

// Start the live clock
setInterval(updateLiveClocks, 1000);
updateLiveClocks();
setInterval(updateSolCounter, 1000);
updateSolCounter();
setInterval(updateMarsDateDisplay, 1000);
updateMarsDateDisplay();
setInterval(drawMarsClock, 1000);
drawMarsClock();
// Digital Clocks
// setInterval(updateDigitalClocks, 1000);
// updateDigitalClocks();