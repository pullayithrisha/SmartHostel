const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            overflow: hidden;
            background-color: #F9FAFB;
          }
          .header {
            background-color: #534AB7;
            padding: 24px;
            text-align: center;
            color: #FFFFFF;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .content {
            padding: 32px 24px;
            background-color: #FFFFFF;
            color: #1F2937;
            line-height: 1.6;
          }
          .footer {
            background-color: #26215C;
            padding: 16px;
            text-align: center;
            color: #AFA9EC;
            font-size: 12px;
          }
          .btn {
            display: inline-block;
            background-color: #534AB7;
            color: #FFFFFF !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🏠 SmartHostel</h1>
          </div>
          <div class="content">
            ${html}
          </div>
          <div class="footer">
            &copy; 2026 SmartHostel Team. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"SmartHostel" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: styledHtml
  });
};

module.exports = sendEmail;
