const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
require("dotenv").config();

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

exports.sendEmailNotification = functions.firestore.document("mail/{docId}")
    .onCreate((snap, ctx) => (snap, ctx) => {
      const authData = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: SENDER_EMAIL,
          pass: SENDER_PASSWORD,
        },
      });
      authData
          .sendMail({
            from: "dejesusperezjosedaniel@gmail.com",
            to: "xioneitor@gmail.com",
            subject: "Your submission Info",
            text: "Mensaje de ejemplo de ejemplo",
            html: "Mensaje de ejemplo de ejemplo",
          }).then((res) => console.log("successfully sent that mail"))
          .catch((err) => console.log(err));
    });
