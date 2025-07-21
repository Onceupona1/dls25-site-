const fixtureData = [
  { teamA: "Team Eagles", teamB: "Team Lions", date: "2025-08-01", result: "2 - 1" },
  { teamA: "Team Hawks", teamB: "Team Tigers", date: "2025-08-02", result: "1 - 3" },
  { teamA: "Team Eagles", teamB: "Team Hawks", date: "2025-08-05", result: "1 - 1" },
  { teamA: "Team Lions", teamB: "Team Tigers", date: "2025-08-06", result: "0 - 2" }
];

function renderFixtures() {
  const div = document.getElementById('fixtures');
  let html = `<table>
    <tr><th>Date</th><th>Team A</th><th>Team B</th><th>Result</th></tr>`;
  fixtureData.forEach(fx => {
    html += `<tr>
      <td>${fx.date}</td>
      <td>${fx.teamA}</td>
      <td>${fx.teamB}</td>
      <td>${fx.result}</td>
    </tr>`;
  });
  html += `</table>`;
  div.innerHTML = html;
}

renderFixtures();
