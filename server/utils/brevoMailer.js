const axios = require("axios");

exports.sendOtpEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY missing");
  }
  console.log("BREVO KEY:", process.env.BREVO_API_KEY);

  return axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "BookMyShow Clone",
        email: "no-reply@bookmyshow.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
};
