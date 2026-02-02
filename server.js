const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const FROM_EMAIL = process.env.SENDGRID_FROM;

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/send-code", async (req, res) => {
  const { email, name, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: "missing-fields" });
  }
  if (!process.env.SENDGRID_API_KEY || !FROM_EMAIL) {
    return res.status(500).json({ error: "sendgrid-not-configured" });
  }

  const message = {
    to: email,
    from: FROM_EMAIL,
    subject: "Tower Defense Verifizierungscode",
    text: `Hallo ${name || ""},\n\nDein Verifizierungscode lautet: ${code}\n\nViel Spass!`,
  };

  try {
    await sgMail.send(message);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "send-failed" });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
