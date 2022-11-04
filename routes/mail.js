const express = require("express");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
);

router.post("/", async (req, res) => {
  const { name, tel, email } = req.body;
  if (!name && !tel && !email)
    return res.status(400).json({ err: "Bad request." });
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "office@topestate.md",
      subject: "New inquiry",
      html: `
      <h2>Noua cerere de apel</h2>
      <div>
      <div>
      <span>Nume: </span>${name}
      </div>
      
      <div>
      <span>Telefon: </span>${tel}
      </div>
      
      <div>
      <span>Email: </span>${email}
      </div>
      </div>
    `,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("err");
        console.log(err);
        return res.status(400).json({ err });
      }
      res.status(200).json({ status: "ok" });
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    res.status(400).json({ err });
  }
});

module.exports = router;
