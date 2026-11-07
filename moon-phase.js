(function () {
  const PHASES = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];

  function getMoonPhase(date) {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    if (month < 3) {
      year -= 1;
      month += 12;
    }

    month += 1;

    const c = 365.25 * year;
    const e = 30.6 * month;
    let julianDay = c + e + day - 694039.09;
    julianDay /= 29.5305882;

    const cycle = Math.floor(julianDay);
    julianDay -= cycle;

    const index = Math.round(julianDay * 8) % 8;
    return PHASES[index];
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function updateView(baseDate) {
    const current = document.getElementById("current-phase");
    const forecast = document.getElementById("forecast");

    current.textContent = `Moon phase on ${formatDate(baseDate)}: ${getMoonPhase(baseDate)}`;

    forecast.innerHTML = "";
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(baseDate);
      date.setUTCDate(baseDate.getUTCDate() + i + 1);

      const row = document.createElement("tr");
      const dateCell = document.createElement("td");
      const phaseCell = document.createElement("td");

      dateCell.textContent = formatDate(date);
      phaseCell.textContent = getMoonPhase(date);

      row.appendChild(dateCell);
      row.appendChild(phaseCell);
      forecast.appendChild(row);
    }
  }

  const dateInput = document.getElementById("date");
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  dateInput.value = formatDate(todayUtc);
  updateView(todayUtc);

  dateInput.addEventListener("change", function () {
    if (!dateInput.value) {
      return;
    }
    const selected = new Date(`${dateInput.value}T00:00:00Z`);
    updateView(selected);
  });
})();
