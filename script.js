const SHEETDB_API = "https://sheetdb.io/api/v1/rhgvdm9riye3p";

const regForm = document.getElementById('regForm');
const msgDiv = document.getElementById('msg');

regForm.addEventListener('submit', function(e) {
  e.preventDefault();
  msgDiv.textContent = "Registering your team...";

  const formData = new FormData(regForm);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    team: formData.get('team'),
    logo_url: formData.get('logo_url') || ""
  };

  // Directly save to SheetDB
  fetch(SHEETDB_API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ data: data })
  })
  .then(res => res.json())
  .then(() => {
    // Save data to localStorage for confirmation & highlighting
    localStorage.setItem("registeredTeam", JSON.stringify(data));
    localStorage.setItem("myTeam", data.team);
    if (data.logo_url) localStorage.setItem("myLogo", data.logo_url);
    window.location.href = "success.html";
  })
  .catch(() => {
    msgDiv.textContent = "Error saving registration. Please contact support.";
  });
});
