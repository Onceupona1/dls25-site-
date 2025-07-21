// Replace with your SheetDB endpoint or similar (see below for setup)
const SHEETDB_API = "https://sheetdb.io/api/v1/YOUR_SHEETDB_ID";
// For demo: go to https://sheetdb.io and connect a Google Sheet

const paystackKey = "pk_live_0b6dbae0544edafc7537a0e152426e9f6e804f5b"; // public key

const regForm = document.getElementById('regForm');
const msgDiv = document.getElementById('msg');

regForm.addEventListener('submit', function(e) {
  e.preventDefault();
  msgDiv.textContent = "Processing payment...";

  const formData = new FormData(regForm);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    team: formData.get('team')
  };

  // Start Paystack payment
  let handler = PaystackPop.setup({
    key: paystackKey,
    email: `${data.phone}@demo.com`, // for demo, fake email
    amount: 50 * 100, // Amount in pesewas (GHS 50.00)
    currency: "GHS",
    ref: "REG-" + Date.now(),
    callback: function(response) {
      // Payment successful, save to SheetDB
      msgDiv.textContent = "Payment successful, saving registration...";
      fetch(SHEETDB_API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ data: data })
      })
      .then(res => res.json())
      .then(() => {
        // Store registration in localStorage for demo/confirmation
        localStorage.setItem("registeredTeam", JSON.stringify(data));
        window.location.href = "success.html";
      })
      .catch(() => {
        msgDiv.textContent = "Error saving registration. Please contact support.";
      });
    },
    onClose: function() {
      msgDiv.textContent = "Payment window closed.";
    }
  });
  handler.openIframe();
});
