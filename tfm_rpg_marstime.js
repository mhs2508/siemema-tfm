const marsMonths = [
  { name: "Orion", sols: 28 },      // Der Jäger – bekannteste Winterkonstellation
  { name: "Sirius", sols: 27 },     // Hellster Stern, im "Großen Hund"
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
  { name: "Regulus", sols: 28 },    // Hauptstern im Löwen
  { name: "Leo", sols: 27 },        // Das Sternbild Löwe
  { name: "Spica", sols: 28 },      // Hauptstern der Jungfrau
  { name: "Virgo", sols: 27 },      // Die Jungfrau
  { name: "Antares", sols: 28 },    // Roter Riese im Skorpion
  { name: "Scorpio", sols: 27 },    // Das Sternbild Skorpion
  { name: "Betelgeuse", sols: 28 }, // Schulterstern in Orion – baldige Supernova
  { name: "Canopus", sols: 27 },    // Zweithellster Stern, Navigation auf See
  { name: "Arcturus", sols: 28 },   // Heller Roter Riese in Bootes
  { name: "Deneb", sols: 27 },      // Schwänzchen des Schwans – Teil des Sommerdreiecks
  { name: "Capella", sols: 28 },    // In Auriga (Fuhrmann), einer der hellsten
  { name: "Procyon", sols: 27 }     // In Canis Minor – mit Sirius und Betelgeuse ein Winterdreieck
];

let solBaseDate = new Date(Date.UTC(2000, 0, 6)); // Standardwert: 6. Jan 2000

// Julian Date berechnen
function getJulianDate(date = new Date()) {
  return date.getTime() / 86400000 + 2440587.5;
}

// MSD berechnen
function getMSD(date = new Date()) {
  const jd = getJulianDate(date);
  return (jd - 2405522.0028779) / 1.02749125;
}

// MTC als String HH:MM:SS
function getMTC(date = new Date()) {
  const mtcFloat = (getMSD(date) % 1) * 24;
  const hours = Math.floor(mtcFloat);
  const minutes = Math.floor((mtcFloat % 1) * 60);
  const seconds = Math.floor((((mtcFloat % 1) * 60) % 1) * 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
  const now = new Date();
  const marsDate = getMarsDateFromUTC(now);
  document.getElementById("marsDateLive").innerText =
    `Marsdatum: ${marsDate.day}. ${marsDate.month} ${marsDate.year}`;
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

// Funktion für Visual Mars Clock
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
  ctx.fillStyle = "#ff6347";
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

// Start the live clock
setInterval(updateLiveClocks, 1000);
updateLiveClocks();
setInterval(updateSolCounter, 1000);
updateSolCounter();
setInterval(updateMarsDateDisplay, 1000);
updateMarsDateDisplay();
setInterval(drawMarsClock, 1000);
drawMarsClock();