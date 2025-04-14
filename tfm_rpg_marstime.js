let solBaseDate = new Date(Date.UTC(2000, 0, 6)); // Standardwert: 6. Jan 2000

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
  
  function updateLiveClocks() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
  
    const utcTimeStr = `${pad(utcHours)}:${pad(utcMinutes)}:${pad(utcSeconds)}`;
    document.getElementById("utcClock").innerText = utcTimeStr;
  
    const mtcTimeStr = earthToMarsTime(utcHours, utcMinutes, utcSeconds);
    document.getElementById("mtcClock").innerText = mtcTimeStr;
  }
  
  function convertMTCtoUTC() {
    const timeInput = document.getElementById("marsTime").value;
    if (!timeInput) return;
  
    const [h, m, s] = timeInput.split(":").map(Number);
    const marsSeconds = (h * 3600) + (m * 60) + (s || 0);
    const earthSeconds = marsSeconds * 1.02749125;
  
    const utcHours = Math.floor(earthSeconds / 3600) % 24;
    const utcMinutes = Math.floor((earthSeconds % 3600) / 60);
    const utcSeconds = Math.floor(earthSeconds % 60);
  
    const utcTime = `${pad(utcHours)}:${pad(utcMinutes)}:${pad(utcSeconds)}`;
    document.getElementById("convertedUTC").innerText = `Earth Time (UTC): ${utcTime}`;
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

  // Start the live clock
  setInterval(updateLiveClocks, 1000);
  updateLiveClocks();
  setInterval(updateSolCounter, 1000);
  updateSolCounter();
  