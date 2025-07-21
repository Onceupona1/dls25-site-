const SHEET_API = "https://sheetdb.io/api/v1/rhgvdm9riye3p";

// Helper: Update standings for a team
function updateTeam(stats, team, scored, conceded, result, logo) {
  if (!stats[team]) {
    stats[team] = {team, W:0, D:0, L:0, pts:0, GF:0, GA:0, GD:0, logo: logo || ""};
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
  teams.sort((a, b) =>
    b.pts - a.pts || b.GD - a.GD || b.GF - a.GF
  );

  const myTeam = localStorage.getItem('myTeam');
  let html = `<h3>League Table</h3><table>
    <tr><th>Team</th><th>W</th><th>D</th><th>L</th>
    <th>Pts</th><th>GF</th><th>GA</th><th>GD</th></tr>`;

  teams.forEach(t => {
    const highlight = (t.team === myTeam) ? ' style="background: #ffff99;"' : '';
    const logo = t.logo
      ? `<img src="${t.logo}" alt="" class="team-logo" onerror="this.style.display='none'">`
      : '';
    html += `<tr${highlight}>
      <td>${logo}${t.team}</td>
      <td class="standings-w">${t.W}</td>
      <td class="standings-d">${t.D}</td>
      <td class="standings-l">${t.L}</td>
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
function renderFixtures(fixtures, teamLogos) {
  let html = `<h3>Match Results</h3><table>
    <tr><th>Home</th><th>Away</th><th>Score</th></tr>`;
  fixtures.forEach(m => {
    const homeLogo = (teamLogos[m.home_team])
      ? `<img src="${teamLogos[m.home_team]}" alt="" class="team-logo" onerror="this.style.display='none'">`
      : '';
    const awayLogo = (teamLogos[m.away_team])
      ? `<img src="${teamLogos[m.away_team]}" alt="" class="team-logo" onerror="this.style.display='none'">`
      : '';
    html += `<tr>
      <td>${homeLogo}${m.home_team}</td>
      <td>${awayLogo}${m.away_team}</td>
      <td>${m.home_score} - ${m.away_score}</td>
    </tr>`;
  });
  html += `</table>`;
  document.getElementById('fixtures').innerHTML = html;
}

document.getElementById('fixtures').innerHTML = "Loading fixtures and results...";
document.getElementById('standings').innerHTML = "Loading league table...";

// Fetch and process match data
fetch(SHEET_API)
  .then(res => res.json())
  .then(data => {
    const matches = data.data || data.sheet || [];

    // Build a map of teamName => logo_url from matches or registration sheet
    const teamLogos = {};
    matches.forEach(m => {
      if (m.home_team && m.home_logo_url && !teamLogos[m.home_team]) {
        teamLogos[m.home_team] = m.home_logo_url;
      }
      if (m.away_team && m.away_logo_url && !teamLogos[m.away_team]) {
        teamLogos[m.away_team] = m.away_logo_url;
      }
      // Fallback: If using a registration sheet with logo_url
      if (m.team && m.logo_url && !teamLogos[m.team]) {
        teamLogos[m.team] = m.logo_url;
      }
    });

    renderFixtures(matches, teamLogos);

    let stats = {};
    matches.forEach(m => {
      const hs = parseInt(m.home_score);
      const as = parseInt(m.away_score);
      if (isNaN(hs) || isNaN(as)) return;

      let homeRes = hs > as ? 'W' : hs === as ? 'D' : 'L';
      let awayRes = as > hs ? 'W' : as === hs ? 'D' : 'L';

      updateTeam(stats, m.home_team, hs, as, homeRes, teamLogos[m.home_team]);
      updateTeam(stats, m.away_team, as, hs, awayRes, teamLogos[m.away_team]);
    });
    renderStandings(stats);
  })
  .catch(() => {
    document.getElementById('fixtures').textContent = "Couldn't load fixtures. Please try again later!";
    document.getElementById('standings').textContent = "";
  });
