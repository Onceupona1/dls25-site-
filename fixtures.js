const SHEET_API = "https://sheetdb.io/api/v1/ev3zbcl5xanwt"; // Your SheetDB API

// Helper: Update standings for a team
function updateTeam(stats, team, scored, conceded, result) {
  if (!stats[team]) {
    stats[team] = {team, W:0, D:0, L:0, pts:0, GF:0, GA:0, GD:0};
  }
  stats[team].GF += scored;
  stats[team].GA += conceded;
  stats[team].GD = stats[team].GF - stats[team].GA;
  if (result === 'W') { stats[team].W++; stats[team].pts += 3; }
  else if (result === 'D') { stats[team].D++; stats[team].pts += 1; }
  else if (result === 'L') { stats[team].L++; }
}

// Render standings table
function renderStandings(stats) {
  const teams = Object.values(stats);
  // Sort by pts desc, then GD, then GF
  teams.sort((a, b) =>
    b.pts - a.pts || b.GD - a.GD || b.GF - a.GF
  );
  let html = `<h3>League Table</h3><table>
    <tr><th>Team</th><th>W</th><th>D</th><th>L</th>
    <th>Pts</th><th>GF</th><th>GA</th><th>GD</th></tr>`;
  teams.forEach(t => {
    html += `<tr>
      <td>${t.team}</td>
      <td>${t.W}</td>
      <td>${t.D}</td>
      <td>${t.L}</td>
      <td>${t.pts}</td>
      <td>${t.GF}</td>
      <td>${t.GA}</td>
      <td>${t.GD}</td>
    </tr>`;
  });
  html += `</table>`;
  document.getElementById('standings').innerHTML = html;
}

// Render fixtures/results table
function renderFixtures(fixtures) {
  let html = `<h3>Match Results</h3><table>
    <tr><th>Home</th><th>Away</th><th>Score</th></tr>`;
  fixtures.forEach(m => {
    html += `<tr>
      <td>${m.home_team}</td>
      <td>${m.away_team}</td>
      <td>${m.home_score} - ${m.away_score}</td>
    </tr>`;
  });
  html += `</table>`;
 document.getElementById('fixtures').innerHTML = html;
}
document.getElementById('fixtures').innerHTML = "Loading fixtures and results...";
document.getElementById('standings').innerHTML = "Loading league table...";

fetch(SHEET_API)
  .then(res => res.json())
  ...
// Fetch and process data
fetch(SHEET_API)
  .then(res => res.json())
  .then(data => {
    const matches = data.data || data.sheet || [];
    renderFixtures(matches);

    // Calculate standings
    let stats = {};
    matches.forEach(m => {
      const hs = parseInt(m.home_score);
      const as = parseInt(m.away_score);
      if (isNaN(hs) || isNaN(as)) return; // skip invalid

      // Home team result
      let homeRes = hs > as ? 'W' : hs === as ? 'D' : 'L';
      // Away team result
      let awayRes = as > hs ? 'W' : as === hs ? 'D' : 'L';

      updateTeam(stats, m.home_team, hs, as, homeRes);
      updateTeam(stats, m.away_team, as, hs, awayRes);
    });
    renderStandings(stats);
  })
  .catch(() => {
    document.getElementById('fixtures').textContent = "Error loading data.";
    document.getElementById('standings').textContent = "";
  });
